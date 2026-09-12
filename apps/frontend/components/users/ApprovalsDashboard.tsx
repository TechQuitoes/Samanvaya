"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, RefreshCw, Clock, Users, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useAdminApprovals from "@/hooks/useAdminApprovals";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import SacredPageHeader from "@/components/common/SacredPageHeader";
import SacredPillTabs, { SacredPillTabItem } from "@/components/common/SacredPillTabs";
import SacredTableContainer from "@/components/common/SacredTableContainer";
import ApprovalStatCards from "./ApprovalStatCards";
import UserTableList from "./UserTableList";

export default function ApprovalsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab");

  const getInitialTab = (tabStr: string | null) => {
    if (tabStr === "pending") return "pending";
    if (tabStr === "blocked" || tabStr === "rejected" || tabStr === "blocked_rejected") return "blocked_rejected";
    return "all";
  };

  const [activeTab, setActiveTab] = useState<string>(() => getInitialTab(tabQuery));

  // Sync tab with URL query parameter when navigating from notifications
  useEffect(() => {
    if (tabQuery) {
      setActiveTab(getInitialTab(tabQuery));
    }
  }, [tabQuery]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const param = val === "all" ? "users" : val;
    router.replace(`/admin/approvals?tab=${param}`, { scroll: false });
  };

  const {
    approvedUsers,
    pendingUsers,
    blockedAndRejectedUsers,
    blockedCount,
    rejectedCount,
    isLoading,
    isUpdating,
    fetchAllUsers,
    updateUserStatus,
  } = useAdminApprovals();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllUsers();
    setIsRefreshing(false);
  };

  const tabItems: SacredPillTabItem[] = [
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
  ];

  return (
    <SacredPortalLayout>
      {/* Title & Refresh Row using SacredPageHeader */}
      <SacredPageHeader
        title="Users & Approvals"
        subtitle="Manage verified members, review pending requests and control access"
        icon={Shield}
        actions={
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold gap-1.5 sm:gap-2 flex-shrink-0 shadow-sm cursor-pointer h-9 sm:h-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
        }
      />

      {/* Sacred Summary Stat Cards */}
      <ApprovalStatCards
        approvedCount={approvedUsers.length}
        pendingCount={pendingUsers.length}
        blockedCount={blockedCount}
        rejectedCount={rejectedCount}
        isLoading={isLoading}
      />

      {/* Main Tabs Container: Synced via activeTab state & URL query */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-4">
        <SacredPillTabs
          tabs={tabItems}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {/* Tab 1 Content: Approved Members */}
        <TabsContent value="all" className="mt-0">
          <SacredTableContainer>
            <UserTableList
              users={approvedUsers}
              type="all"
              isLoading={isLoading}
              isUpdating={isUpdating}
              updateUserStatus={updateUserStatus}
            />
          </SacredTableContainer>
        </TabsContent>

        {/* Tab 2 Content: Pending Approvals */}
        <TabsContent value="pending" className="mt-0">
          <SacredTableContainer>
            <UserTableList
              users={pendingUsers}
              type="pending"
              isLoading={isLoading}
              isUpdating={isUpdating}
              updateUserStatus={updateUserStatus}
            />
          </SacredTableContainer>
        </TabsContent>

        {/* Tab 3 Content: Blocked & Rejected Accounts (Sorted by Blocked First) */}
        <TabsContent value="blocked_rejected" className="mt-0">
          <SacredTableContainer className="border-rose-200/80">
            <UserTableList
              users={blockedAndRejectedUsers}
              type="rejected"
              isLoading={isLoading}
              isUpdating={isUpdating}
              updateUserStatus={updateUserStatus}
            />
          </SacredTableContainer>
        </TabsContent>
      </Tabs>
    </SacredPortalLayout>
  );
}
