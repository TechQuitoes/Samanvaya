"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  CheckSquare,
  MapPin,
  Sparkles,
  UserCheck,
  Building,
  HeartHandshake,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import DataManager from "@/lib/data-manager";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = DataManager.getToken();
    const currentUser = DataManager.getUser();

    if (!token || !currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3e9]">
        <div className="animate-pulse text-[#174824] text-base font-semibold">
          Loading Seva Portal...
        </div>
      </div>
    );
  }

  return (
    <SacredPortalLayout>
      <LotusDivider maxWidth="full" iconSize={20} className="my-1" />

      {/* Top Summary & Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location Card */}
        <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 border border-[#e5d9c3] bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8c7865] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#174824]" />
            <span>Temple / Center</span>
          </div>
          <p className="text-xl font-bold text-[#174824]">
            {user.temple?.name || "ISKCON Leader Center"}
          </p>
          <p className="text-xs text-[#5a4836] font-medium">
            Status: <span className="text-emerald-800 font-bold">Active Seva</span>
          </p>
        </Card>

        {/* Today's Summary Card */}
        <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 border border-[#e5d9c3] bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
          <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
            Today&apos;s Summary
          </p>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div>
              <p className="text-xl font-bold text-[#174824]">2</p>
              <p className="text-[11px] text-[#5a4836]">Meetings</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#174824]">6</p>
              <p className="text-[11px] text-[#5a4836]">Tasks</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#174824]">4</p>
              <p className="text-[11px] text-[#5a4836]">Pending Docs</p>
            </div>
          </div>
        </Card>

        {/* Verification Status Card */}
        <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 border border-emerald-300/80 bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8c7865] uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-[#174824]" />
            <span>Account Status</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5">
              VERIFIED & APPROVED
            </Badge>
          </div>
          <p className="text-xs text-emerald-900 font-medium">
            Verified by Administrator
          </p>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#174824] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Quick Actions</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="rounded-[20px] p-4 border border-[#e5d9c3] bg-[#faf4e8] hover:bg-[#fffdf7] transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer group shadow-xs">
            <div className="p-3 rounded-2xl bg-[#174824]/10 text-[#174824] group-hover:scale-105 transition-transform">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#2c221e]">Calendar</span>
          </Card>

          <Card className="rounded-[20px] p-4 border border-[#e5d9c3] bg-[#faf4e8] hover:bg-[#fffdf7] transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer group shadow-xs">
            <div className="p-3 rounded-2xl bg-[#174824]/10 text-[#174824] group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#2c221e]">Documentation</span>
          </Card>

          <Card className="rounded-[20px] p-4 border border-[#e5d9c3] bg-[#faf4e8] hover:bg-[#fffdf7] transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer group shadow-xs">
            <div className="p-3 rounded-2xl bg-[#174824]/10 text-[#174824] group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#2c221e]">Journal</span>
          </Card>

          <Card className="rounded-[20px] p-4 border border-[#e5d9c3] bg-[#faf4e8] hover:bg-[#fffdf7] transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer group shadow-xs">
            <div className="p-3 rounded-2xl bg-[#174824]/10 text-[#174824] group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#2c221e]">Tasks</span>
          </Card>
        </div>
      </div>

      {/* Welcome Seva Notice Card */}
      <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-6 border border-[#e5d9c3] bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#174824] text-white">
            <HeartHandshake className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#174824]">
              Welcome to LDMS Seva Portal
            </h3>
            <p className="text-xs text-[#5a4836] font-medium">
              Leader Documentation & Management System
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#4a3e31] leading-relaxed">
          Your account is verified and ready for service. Use the quick action tools to access documentation, track schedules, and coordinate seva tasks.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-[#e5d9c3]/60 text-xs font-semibold text-[#174824]">
          <span className="flex items-center gap-1.5">
            <Building className="w-4 h-4 text-amber-600" />
            <span>Serving Leaders. Strengthening Seva.</span>
          </span>
        </div>
      </Card>
    </SacredPortalLayout>
  );
}
