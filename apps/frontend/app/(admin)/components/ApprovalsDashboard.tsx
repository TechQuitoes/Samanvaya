"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, RefreshCw, Clock, Users, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAdminApprovals from "@/app/(admin)/hooks/useAdminApprovals";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
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

  return (
    <SacredPortalLayout>
      {/* Title & Refresh Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-2xl font-bold text-[#174824] truncate">
              Users & Approvals
            </h2>
            <p className="text-[11px] sm:text-sm text-[#5a4836] font-medium hidden sm:block">
              Manage verified members, review pending requests and control access
            </p>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold gap-1.5 sm:gap-2 flex-shrink-0 shadow-sm cursor-pointer h-9 sm:h-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh Data</span>
          <span className="sm:hidden">Refresh</span>
        </Button>
      </div>

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
        <TabsList className="bg-[#faf4e8] border border-[#e5d9c3] p-1 sm:p-1.5 rounded-2xl w-full sm:w-auto grid grid-cols-3 sm:flex sm:inline-flex justify-start h-auto gap-1 shadow-xs">
          {/* Tab 1: Active Verified Members */}
          <TabsTrigger
            value="all"
            className="flex-1 sm:flex-initial justify-center rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#5a4836] transition-all flex items-center gap-1 sm:gap-2 cursor-pointer select-none"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Users</span>
            <span className="hidden sm:inline">List</span>
            <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] bg-[#174824]/15 text-[#174824] data-[state=active]:bg-white/20 data-[state=active]:text-white font-bold">
              {approvedUsers.length}
            </span>
          </TabsTrigger>

          {/* Tab 2: Pending Approvals */}
          <TabsTrigger
            value="pending"
            className="flex-1 sm:flex-initial justify-center rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#5a4836] transition-all flex items-center gap-1 sm:gap-2 cursor-pointer select-none"
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Pending</span>
            <span className="hidden sm:inline">Approvals</span>
            <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] bg-amber-200 text-amber-950 data-[state=active]:bg-amber-100 data-[state=active]:text-[#174824] font-bold">
              {pendingUsers.length}
            </span>
          </TabsTrigger>

          {/* Tab 3: Blocked & Rejected */}
          <TabsTrigger
            value="blocked_rejected"
            className="flex-1 sm:flex-initial justify-center rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#5a4836] transition-all flex items-center gap-1 sm:gap-2 cursor-pointer select-none"
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate sm:hidden">Blocked</span>
            <span className="hidden sm:inline">Blocked / Rejected</span>
            <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] bg-rose-200 text-rose-950 data-[state=active]:bg-rose-100 data-[state=active]:text-[#174824] font-bold">
              {blockedAndRejectedUsers.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1 Content: Approved Members */}
        <TabsContent value="all" className="mt-0">
          <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border-[#e5d9c3] bg-[#faf4e8] p-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-40 z-0">
              <Image
                src="/assests/rightSideLeaf.png"
                alt="Leaf Accent"
                fill
                className="object-contain object-top-right"
              />
            </div>
            <UserTableList
              users={approvedUsers}
              type="all"
              isLoading={isLoading}
              isUpdating={isUpdating}
              updateUserStatus={updateUserStatus}
            />
          </Card>
        </TabsContent>

        {/* Tab 2 Content: Pending Approvals */}
        <TabsContent value="pending" className="mt-0">
          <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border-[#e5d9c3] bg-[#faf4e8] p-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-40 z-0">
              <Image
                src="/assests/rightSideLeaf.png"
                alt="Leaf Accent"
                fill
                className="object-contain object-top-right"
              />
            </div>
            <UserTableList
              users={pendingUsers}
              type="pending"
              isLoading={isLoading}
              isUpdating={isUpdating}
              updateUserStatus={updateUserStatus}
            />
          </Card>
        </TabsContent>

        {/* Tab 3 Content: Blocked & Rejected Accounts (Sorted by Blocked First) */}
        <TabsContent value="blocked_rejected" className="mt-0">
          <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border-rose-200/80 bg-[#faf4e8] p-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-40 z-0">
              <Image
                src="/assests/rightSideLeaf.png"
                alt="Leaf Accent"
                fill
                className="object-contain object-top-right"
              />
            </div>
            <UserTableList
              users={blockedAndRejectedUsers}
              type="rejected"
              isLoading={isLoading}
              isUpdating={isUpdating}
              updateUserStatus={updateUserStatus}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </SacredPortalLayout>
  );
}
