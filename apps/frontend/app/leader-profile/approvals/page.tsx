"use client";

import { Suspense } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import SacredPillTabs from "@/components/common/SacredPillTabs";
import SacredTableContainer from "@/components/common/SacredTableContainer";
import EButton from "@/components/common/EButton";
import ApprovalStatCards from "@/components/users/ApprovalStatCards";
import UserTableList from "@/components/users/UserTableList";
import useApprovalsDashboard from "@/hooks/user/useApprovalsDashboard";

function ApprovalsDashboardContent() {
  const {
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
    updateUserStatus,
  } = useApprovalsDashboard();

  return (
    <SacredPortalLayout
      title="Users & Approvals"
      subtitle="Manage verified members, review pending requests and control access"
      icon={Shield}
      actions={
        <EButton
          onClick={handleRefresh}
          isLoading={isRefreshing}
          loadingText="Refreshing..."
          leftIcon={<RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          size="sm"
          variant="primary"
          className="rounded-xl sm:rounded-2xl px-3 sm:px-4 text-xs sm:text-sm"
        >
          Refresh Data
        </EButton>
      }
    >
      {/* Sacred Summary Stat Cards */}
      <ApprovalStatCards
        approvedCount={approvedUsers.length}
        pendingCount={pendingUsers.length}
        blockedCount={blockedCount}
        rejectedCount={rejectedCount}
        isLoading={isLoading}
      />

      {/* Main Tabs Container: Synced via activeTab state & URL query */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-4"
      >
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

export default function ApprovalsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#174824] font-semibold">
          Loading Approvals...
        </div>
      }
    >
      <ApprovalsDashboardContent />
    </Suspense>
  );
}
