"use client";

import Image from "next/image";
import { Clock, ShieldAlert, Shield, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ApprovalStatCardsProps {
  pendingCount: number;
  rejectedCount: number;
  isLoading: boolean;
}

export default function ApprovalStatCards({
  pendingCount,
  rejectedCount,
  isLoading,
}: ApprovalStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: Pending Approvals */}
      <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 border border-[#e5d9c3] bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-60">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
            Pending Approvals
          </p>
          <p className="text-3xl font-bold text-[#174824]">
            {isLoading ? "—" : pendingCount}
          </p>
          <p className="text-xs text-amber-800 font-semibold">
            Action Required
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300/60 shadow-xs relative z-10">
          <Clock className="w-6 h-6 text-amber-700 animate-pulse" />
        </div>
      </Card>

      {/* Card 2: Rejected Accounts */}
      <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 border border-red-200/80 bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-60">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
            Rejected Accounts
          </p>
          <p className="text-3xl font-bold text-red-800">
            {isLoading ? "—" : rejectedCount}
          </p>
          <p className="text-xs text-red-700 font-semibold">
            Re-approvable Anytime
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-red-100/90 border border-red-300/60 shadow-xs relative z-10">
          <ShieldAlert className="w-6 h-6 text-red-700" />
        </div>
      </Card>

      {/* Card 3: Gate Status */}
      <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 border border-emerald-300/80 bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-60">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
            Approval Gate
          </p>
          <p className="text-xl font-bold text-[#174824] flex items-center gap-1.5">
            <span>Verification Active</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </p>
          <p className="text-xs text-emerald-800 font-semibold">
            Secure LDMS Protection
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-100/90 border border-emerald-300/60 shadow-xs relative z-10">
          <Shield className="w-6 h-6 text-[#174824]" />
        </div>
      </Card>
    </div>
  );
}
