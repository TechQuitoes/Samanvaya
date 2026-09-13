"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Clock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { User, UserStatus } from "@/types/auth";
import { SacredPillTabItem } from "@/components/common/SacredPillTabs";

export function useApprovalsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab");

  const getInitialTab = (tabStr: string | null) => {
    if (tabStr === "pending") return "pending";
    if (
      tabStr === "blocked" ||
      tabStr === "rejected" ||
      tabStr === "blocked_rejected"
    )
      return "blocked_rejected";
    return "all";
  };

  const [activeTab, setActiveTab] = useState<string>(() =>
    getInitialTab(tabQuery)
  );

  // Sync tab with URL query parameter when navigating from notifications
  useEffect(() => {
    if (tabQuery) {
      setActiveTab(getInitialTab(tabQuery));
    }
  }, [tabQuery]);

  const handleTabChange = useCallback(
    (val: string) => {
      setActiveTab(val);
      const param = val === "all" ? "users" : val;
      router.replace(`/leader-profile/approvals?tab=${param}`, { scroll: false });
    },
    [router]
  );

  const [allUsersList, setAllUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const allRes = await apiNexus.call<User[]>("GET_USERS");
      if (allRes.isSuccess && Array.isArray(allRes.data)) {
        setAllUsersList(allRes.data);
      } else {
        setAllUsersList([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load users list.");
      setAllUsersList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAllUsers();
    setIsRefreshing(false);
  }, [fetchAllUsers]);

  // Tab 1: Active Verified Members (ONLY status === APPROVED)
  const approvedUsers = useMemo(() => {
    return allUsersList.filter((u) => u.status === UserStatus.APPROVED);
  }, [allUsersList]);

  // Tab 2: Pending Registration Requests (ONLY status === PENDING_APPROVAL)
  const pendingUsers = useMemo(() => {
    return allUsersList.filter((u) => u.status === UserStatus.PENDING_APPROVAL);
  }, [allUsersList]);

  // Tab 3: Blocked & Rejected Accounts (sorted with BLOCKED at top)
  const blockedAndRejectedUsers = useMemo(() => {
    const list = allUsersList.filter(
      (u) => u.status === UserStatus.BLOCKED || u.status === UserStatus.REJECTED
    );
    return list.sort((a, b) => {
      if (a.status === UserStatus.BLOCKED && b.status !== UserStatus.BLOCKED) return -1;
      if (a.status !== UserStatus.BLOCKED && b.status === UserStatus.BLOCKED) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [allUsersList]);

  const blockedCount = useMemo(() => {
    return allUsersList.filter((u) => u.status === UserStatus.BLOCKED).length;
  }, [allUsersList]);

  const rejectedCount = useMemo(() => {
    return allUsersList.filter((u) => u.status === UserStatus.REJECTED).length;
  }, [allUsersList]);

  const updateUserStatus = useCallback(
    async (
      userId: string,
      status: UserStatus,
      role?: string,
      permissions?: Record<string, Record<string, boolean>>
    ) => {
      setIsUpdating(userId);
      try {
        const payload: Record<string, any> = { status };
        if (role) payload.role = role;
        if (permissions) payload.permissions = permissions;

        const response = await apiNexus.call<User>("PATCH_USER_STATUS", {
          params: { id: userId },
          payload,
        });

        if (!response.isSuccess) {
          throw new Error(response.message || "Failed to update user status.");
        }

        let actionText = "updated";
        if (status === UserStatus.APPROVED) actionText = "approved";
        else if (status === UserStatus.BLOCKED) actionText = "blocked";
        else if (status === UserStatus.REJECTED) actionText = "rejected";

        toast.success(`User account ${actionText} successfully!`);

        // Refresh all lists cleanly
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

  const tabItems: SacredPillTabItem[] = useMemo(
    () => [
      {
        id: "all",
        label: "Users List",
        count: approvedUsers.length,
        icon: Users,
        countVariant: "default",
      },
      {
        id: "pending",
        label: "Pending Approvals",
        count: pendingUsers.length,
        icon: Clock,
        countVariant: "amber",
      },
      {
        id: "blocked_rejected",
        label: "Blocked / Rejected",
        count: blockedAndRejectedUsers.length,
        icon: ShieldAlert,
        countVariant: "rose",
      },
    ],
    [approvedUsers.length, pendingUsers.length, blockedAndRejectedUsers.length]
  );

  return {
    activeTab,
    handleTabChange,
    tabItems,
    approvedUsers,
    pendingUsers,
    blockedAndRejectedUsers,
    blockedCount,
    rejectedCount,
    isLoading,
    isUpdating,
    isRefreshing,
    handleRefresh,
    fetchAllUsers,
    updateUserStatus,
  };
}

export default useApprovalsDashboard;
