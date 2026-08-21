"use client";

import { useState, useEffect, useCallback } from "react";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import DataManager from "@/lib/data-manager";
import { AppNotification, NotificationsResponse } from "@/types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    const token = DataManager.getToken();
    if (!token) return;

    try {
      const res = await apiNexus.call<NotificationsResponse>("GET_NOTIFICATIONS", {
        params: { limit: 20 },
      });

      if (res.isSuccess && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Silent fail
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        // Optimistic UI update
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await apiNexus.call("PATCH_MARK_NOTIFICATION_READ", {
          params: { id },
        });
      } catch {
        // Revert on error if needed
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await apiNexus.call("PATCH_MARK_ALL_NOTIFICATIONS_READ");
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for background in-app updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}

export default useNotifications;
