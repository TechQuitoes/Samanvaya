"use client";

import { useState } from "react";
import Image from "next/image";
import { Shield, RefreshCw, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LotusDivider from "@/components/ui/LotusDivider";
import useAdminApprovals from "@/app/(admin)/hooks/useAdminApprovals";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import ApprovalStatCards from "./ApprovalStatCards";
import UserTableList from "./UserTableList";

export default function ApprovalsDashboard() {
  const {
    pendingUsers,
    rejectedUsers,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#174824]">
                Account Approvals & Management
              </h2>
              <p className="text-xs sm:text-sm text-[#5a4836] font-medium">
                Review pending registrations and manage user access statuses
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold gap-2 self-start sm:self-auto shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Sacred Summary Stat Cards */}
      <ApprovalStatCards
        pendingCount={pendingUsers.length}
        rejectedCount={rejectedUsers.length}
        isLoading={isLoading}
      />

      {/* Main Tabs Container */}
      <Tabs defaultValue="pending" className="w-full space-y-4">
        <TabsList className="bg-[#faf4e8] border border-[#e5d9c3] p-1.5 rounded-2xl w-full sm:w-auto justify-start h-auto flex flex-wrap gap-1 shadow-xs">
          <TabsTrigger
            value="pending"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#5a4836] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Pending Approvals</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-200 text-amber-950 data-[state=active]:bg-amber-100 data-[state=active]:text-[#174824] font-bold">
              {pendingUsers.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="rejected"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#5a4836] transition-all flex items-center gap-2 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Rejected Accounts</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-red-200 text-red-950 data-[state=active]:bg-red-100 data-[state=active]:text-[#174824] font-bold">
              {rejectedUsers.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Pending Approvals Tab Content */}
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

        {/* Rejected Accounts Tab Content */}
        <TabsContent value="rejected" className="mt-0">
          <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border-red-200/80 bg-[#faf4e8] p-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-40 z-0">
              <Image
                src="/assests/rightSideLeaf.png"
                alt="Leaf Accent"
                fill
                className="object-contain object-top-right"
              />
            </div>
            <UserTableList
              users={rejectedUsers}
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
