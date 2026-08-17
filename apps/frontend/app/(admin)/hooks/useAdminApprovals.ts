"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { User, UserStatus } from "@/types/auth";

export function useAdminApprovals() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendingRes, rejectedRes] = await Promise.all([
        apiNexus.call<User[]>("GET_PENDING_USERS"),
        apiNexus.call<User[]>("GET_REJECTED_USERS"),
      ]);

      if (pendingRes.isSuccess && Array.isArray(pendingRes.data)) {
        setPendingUsers(pendingRes.data);
      } else {
        setPendingUsers([]);
      }

      if (rejectedRes.isSuccess && Array.isArray(rejectedRes.data)) {
        setRejectedUsers(rejectedRes.data);
      } else {
        setRejectedUsers([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load approval lists.");
      setPendingUsers([]);
      setRejectedUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserStatus = useCallback(
    async (userId: string, status: UserStatus) => {
      setIsUpdating(userId);
      try {
        const response = await apiNexus.call<User>("PATCH_USER_STATUS", {
          params: { id: userId },
          payload: { status },
        });

        if (!response.isSuccess) {
          throw new Error(response.message || "Failed to update user status.");
        }

        const action = status === UserStatus.APPROVED ? "approved" : "rejected";
        toast.success(`User ${action} successfully!`);

        // Refresh both lists cleanly
        await fetchAllUsers();
      } catch (err: any) {
        toast.error(err.message || "Failed to update user status.");
      } finally {
        setIsUpdating(null);
      }
    },
    [fetchAllUsers]
  );

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    pendingUsers,
    rejectedUsers,
    isLoading,
    isUpdating,
    fetchAllUsers,
    updateUserStatus,
  };
}

export default useAdminApprovals;
