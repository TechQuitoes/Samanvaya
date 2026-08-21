"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Check browser support and current permission state
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            setIsSubscribed(!!sub);
          });
        })
        .catch((err) => {
          console.warn("ServiceWorker registration failed:", err);
        });

      // Listen for permission state changes (if user grants later in browser settings)
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: "notifications" as PermissionName })
          .then((permissionStatus) => {
            permissionStatus.onchange = () => {
              setPermission(Notification.permission);
              if (Notification.permission === "granted") {
                // Auto subscribe if logged in
                const user = DataManager.getUser();
                const token = DataManager.getToken();
                if (user && token) {
                  subscribeUser();
                }
              }
            };
          })
          .catch(() => {});
      }
    }
  }, []);

  const subscribeUser = useCallback(async () => {
    const user = DataManager.getUser();
    const token = DataManager.getToken();
    if (!user || !token || !("serviceWorker" in navigator)) return;

    setIsLoading(true);
    try {
      // 1. Request browser permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        setIsLoading(false);
        return;
      }

      // 2. Get VAPID public key
      const vapidKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        "BBzFPuYTmPlWSeXOKQCpdiehrKU-iUuaywflWLsMRHE9Cyg9pXKIf2N-3yJlvwK8FCKverhGjCk5rmQ6eiNsrJs";

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const applicationServerKey = urlBase64ToUint8Array(vapidKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as any,
        });
      }

      // 3. Register subscription on backend
      const subJson = subscription.toJSON();
      if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
        await apiNexus.call("POST_SUBSCRIBE_PUSH", {
          payload: {
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys.p256dh,
              auth: subJson.keys.auth,
            },
            userAgent: navigator.userAgent,
          },
        });
        setIsSubscribed(true);
      }
    } catch (err: any) {
      console.warn("Push subscription failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribeUser = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;

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
      }
    } catch (err: any) {
      console.warn("Unsubscribe push failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-prompt / subscribe once user logs in (if already granted)
  useEffect(() => {
    const user = DataManager.getUser();
    const token = DataManager.getToken();
    if (user && token && isSupported && Notification.permission === "granted") {
      subscribeUser();
    }
  }, [isSupported, subscribeUser]);

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
