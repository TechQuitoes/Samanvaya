"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import DataManager from "@/lib/data-manager";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const router = useRouter();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSubscribingRef = useRef(false);

  const subscribeUser = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || isSubscribingRef.current) return;

    const user = DataManager.getUser();
    const token = DataManager.getToken();
    if (!user || !token) {
      console.log("[Push] User not logged in, skipping subscription");
      return;
    }

    isSubscribingRef.current = true;
    setIsLoading(true);

    try {
      console.log("[Push] Requesting notification permission...");
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        console.warn("[Push] Permission not granted:", result);
        setIsLoading(false);
        isSubscribingRef.current = false;
        return;
      }

      const vapidKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        "BBzFPuYTmPlWSeXOKQCpdiehrKU-iUuaywflWLsMRHE9Cyg9pXKIf2N-3yJlvwK8FCKverhGjCk5rmQ6eiNsrJs";

      console.log("[Push] Waiting for ServiceWorker ready...");
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      if (!subscription) {
        console.log("[Push] Creating new PushSubscription via pushManager...");
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as any,
        });
      } else {
        // If an existing subscription has invalid keys, renew it
        try {
          const testJson = subscription.toJSON();
          if (!testJson.keys?.p256dh || !testJson.keys?.auth) {
            await subscription.unsubscribe();
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey as any,
            });
          }
        } catch {
          await subscription.unsubscribe();
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as any,
          });
        }
      }

      console.log("[Push] Subscription endpoint obtained:", subscription.endpoint);
      const subJson = subscription.toJSON();
      if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
        console.log("[Push] Registering subscription to backend...");
        const res = await apiNexus.call("POST_SUBSCRIBE_PUSH", {
          payload: {
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys.p256dh,
              auth: subJson.keys.auth,
            },
            userAgent: navigator.userAgent,
          },
        });
        console.log("[Push] Backend register response:", res);
        setIsSubscribed(true);
      }
    } catch (err: any) {
      console.error("[Push] Subscription error:", err);
    } finally {
      setIsLoading(false);
      isSubscribingRef.current = false;
    }
  }, []);

  const unsubscribeUser = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        setIsSubscribed(false);

        // Remove from backend
        await apiNexus.call("POST_UNSUBSCRIBE_PUSH", {
          payload: { endpoint },
        });
        console.log("[Push] Push subscription removed");
      }
    } catch (err: any) {
      console.error("[Push] Unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Initial Service Worker setup and permission check
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then(async (reg) => {
          console.log("[Push] ServiceWorker registered:", reg.scope);
          const sub = await reg.pushManager.getSubscription();
          setIsSubscribed(!!sub);

          // If already granted, ensure token is registered on backend
          if (Notification.permission === "granted") {
            subscribeUser();
          }
        })
        .catch((err) => {
          console.warn("[Push] ServiceWorker registration failed:", err);
        });

      // Listen for permission state changes (if user grants later in browser settings)
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: "notifications" as PermissionName })
          .then((permissionStatus) => {
            permissionStatus.onchange = () => {
              const newPerm = Notification.permission;
              setPermission(newPerm);
              console.log("[Push] Permission changed to:", newPerm);
              if (newPerm === "granted") {
                subscribeUser();
              }
            };
          })
          .catch(() => {});
      }

      // Listen for messages from service worker (for foreground in-app toasts)
      // Singleton guard: prevents duplicate listeners if hook is called in multiple components (e.g. mobile & desktop headers)
      if (!(window as any).__samanvaya_sw_listener_attached) {
        (window as any).__samanvaya_sw_listener_attached = true;

        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === "PUSH_NOTIFICATION_RECEIVED") {
            const toastId = event.data.id || `push-${event.data.title}-${event.data.body}`;
            
            // Dispatch window event so Bell icon unread count updates instantly
            window.dispatchEvent(new CustomEvent("samanvaya:notification-received"));

            toast(event.data.title || "New Notification", {
              id: toastId,
              description: event.data.body,
              duration: 8000,
              action: event.data.actionUrl
                ? {
                    label: "Review",
                    onClick: () => router.push(event.data.actionUrl),
                  }
                : undefined,
            });
          }
        };

        navigator.serviceWorker.addEventListener("message", handleMessage);
      }
    }
  }, [subscribeUser, router]);

  // 2. Extra trigger on mount if permission is granted
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      subscribeUser();
    }
  }, [subscribeUser]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribeUser,
    unsubscribeUser,
  };
}

export default usePushNotifications;
