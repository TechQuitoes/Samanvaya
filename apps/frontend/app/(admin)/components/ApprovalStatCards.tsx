"use client";

import Image from "next/image";
import { Clock, Users, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ApprovalStatCardsProps {
  approvedCount: number;
  pendingCount: number;
  blockedCount: number;
  rejectedCount: number;
  isLoading: boolean;
}

export default function ApprovalStatCards({
  approvedCount,
  pendingCount,
  blockedCount,
  rejectedCount,
  isLoading,
}: ApprovalStatCardsProps) {
  const totalBlockedAndRejected = blockedCount + rejectedCount;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {/* Card 1: Active Users */}
      <Card className="relative overflow-hidden rounded-xl sm:rounded-[28px] p-2.5 sm:p-5 border border-[#e5d9c3] bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-12 sm:w-20 h-12 sm:h-20 pointer-events-none opacity-40 sm:opacity-60">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
        <div className="space-y-0.5 sm:space-y-1 relative z-10 min-w-0">
          <p className="text-[9px] sm:text-xs font-bold text-[#8c7865] uppercase tracking-wider truncate">
            Active Users
          </p>
          <p className="text-xl sm:text-3xl font-bold text-[#174824]">
            {isLoading ? "—" : approvedCount}
          </p>
          <p className="text-[9px] sm:text-xs text-[#5a4836] font-semibold truncate hidden xs:block">
            Verified Members
          </p>
        </div>
        <div className="p-1.5 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[#174824]/10 border border-[#174824]/20 shadow-xs relative z-10 flex-shrink-0">
          <Users className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#174824]" />
        </div>
      </Card>

      {/* Card 2: Pending Approvals */}
      <Card className="relative overflow-hidden rounded-xl sm:rounded-[28px] p-2.5 sm:p-5 border border-amber-300/80 bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-12 sm:w-20 h-12 sm:h-20 pointer-events-none opacity-40 sm:opacity-60">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
        <div className="space-y-0.5 sm:space-y-1 relative z-10 min-w-0">
          <p className="text-[9px] sm:text-xs font-bold text-[#8c7865] uppercase tracking-wider truncate">
            Pending
          </p>
          <p className="text-xl sm:text-3xl font-bold text-amber-900">
            {isLoading ? "—" : pendingCount}
          </p>
          <p className="text-[9px] sm:text-xs text-amber-800 font-semibold truncate hidden xs:block">
            Needs Review
          </p>
        </div>
        <div className="p-1.5 sm:p-3.5 rounded-lg sm:rounded-2xl bg-amber-100/90 border border-amber-300/60 shadow-xs relative z-10 flex-shrink-0">
          <Clock className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-amber-700 animate-pulse" />
        </div>
      </Card>

      {/* Card 3: Blocked & Rejected Accounts */}
      <Card className="relative overflow-hidden rounded-xl sm:rounded-[28px] p-2.5 sm:p-5 border border-rose-200/80 bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-12 sm:w-20 h-12 sm:h-20 pointer-events-none opacity-40 sm:opacity-60">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
        <div className="space-y-0.5 sm:space-y-1 relative z-10 min-w-0">
          <p className="text-[9px] sm:text-xs font-bold text-[#8c7865] uppercase tracking-wider truncate">
            Blocked / Rejected
          </p>
          <p className="text-xl sm:text-3xl font-bold text-rose-800">
            {isLoading ? "—" : totalBlockedAndRejected}
          </p>
          <p className="text-[9px] sm:text-xs text-rose-700 font-semibold truncate hidden xs:block">
            {blockedCount} Blocked · {rejectedCount} Rejected
          </p>
        </div>
        <div className="p-1.5 sm:p-3.5 rounded-lg sm:rounded-2xl bg-rose-100/90 border border-rose-300/60 shadow-xs relative z-10 flex-shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-rose-700" />
        </div>
      </Card>
    </div>
  );
}
