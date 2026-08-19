"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  Plane,
  Heart,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import QuickActionButton from "@/components/dashboard/QuickActionButton";
import TodayScheduleCard from "@/components/dashboard/widgets/TodayScheduleCard";
import UpcomingTravelCard from "@/components/dashboard/widgets/UpcomingTravelCard";
import MyTasksCard from "@/components/dashboard/widgets/MyTasksCard";
import PendingDocsCard from "@/components/dashboard/widgets/PendingDocsCard";
import UpcomingMeetingsCard from "@/components/dashboard/widgets/UpcomingMeetingsCard";
import NotificationsCard from "@/components/dashboard/widgets/NotificationsCard";
import RecentActivitiesCard from "@/components/dashboard/widgets/RecentActivitiesCard";
import DataManager from "@/lib/data-manager";

const QUICK_ACTIONS = [
  { title: "Travel", icon: Plane, href: "/travel" },
  { title: "Calendar", icon: CalendarIcon, href: "/calendar" },
  { title: "Journal", icon: BookOpen, href: "/journal" },
  { title: "Documentation", icon: FileText, href: "/documentation" },
  { title: "Task", icon: CheckSquare, href: "/tasks" },
  { title: "Health", icon: Heart, href: "/health" },
  { title: "Meeting", icon: Users, href: "/meetings" },
  { title: "More", icon: MoreHorizontal, href: "/settings" },
];

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
      {/* Top 2 Cards Row: Current Location (with Temple Sketch) & Today's Summary (with Lotus Accent) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* 1. Current Location Card */}
        <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] px-5 sm:px-6 py-5 sm:py-6 border border-[#e5d9c3] bg-[#fbf8f0] shadow-xs flex flex-col justify-center">
          {/* Temple Sketch Background Illustration on Right */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none overflow-hidden opacity-30 mix-blend-multiply">
            <Image
              src="/assets/card_temple_sketch.jpg"
              alt="Temple Sketch"
              fill
              className="object-contain object-right-bottom"
            />
          </div>

          <div className="relative z-10 flex flex-row items-start gap-3.5">
            {/* Location Pin Icon — Left */}
            <div className="w-9 h-9 mt-0.5 rounded-full bg-white border border-[#d4af37]/50 shadow-sm flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4.5 h-4.5 text-[#174824] fill-[#2d6a4f]" strokeWidth={1.5} />
            </div>

            {/* Text Stack — Right */}
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] sm:text-xs font-semibold text-[#5a4836] tracking-wide leading-tight">
                Current Location
              </p>
              <h3 className="text-base sm:text-lg font-bold font-serif-display text-[#174824] leading-snug">
                {user.temple?.name || "ISKCON Ahmedabad"}
              </h3>
              <p className="text-xs font-semibold text-[#2d6a4f]">
                Travelling
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#8c7865] font-medium">
                Updated 20 mins ago
              </p>
            </div>
          </div>
        </Card>

        {/* 2. Today's Summary Card */}
        <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] px-5 sm:px-6 py-5 sm:py-6 border border-[#e5d9c3] bg-[#fbf8f0] shadow-xs flex flex-col justify-center">
          <div className="relative z-10 space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-[#2c221e]">
              Today&apos;s Summary
            </h4>

            {/* 3 Metric Columns with Dividers */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
              <div className="space-y-1">
                <p className="text-xs text-[#5a4836] font-medium">Meetings</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#174824]">2</p>
              </div>

              <div className="space-y-1 border-l border-[#e5d9c3] pl-3 sm:pl-4">
                <p className="text-xs text-[#5a4836] font-medium">Tasks</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#174824]">6</p>
              </div>

              <div className="space-y-1 border-l border-[#e5d9c3] pl-3 sm:pl-4">
                <p className="text-xs text-[#5a4836] font-medium">Pending Docs</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#174824]">4</p>
              </div>
            </div>
          </div>

          {/* Lotus Accent Motif on Bottom Right */}
          <div className="absolute right-4 bottom-3 w-8 h-8 opacity-70 pointer-events-none">
            <Image
              src="/assets/04_lotus_icon_gold.png"
              alt="Lotus Motif"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-2.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#2c221e]">
          Quick Actions
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionButton
              key={action.title}
              title={action.title}
              icon={action.icon}
              onClick={() => router.push(action.href)}
            />
          ))}
        </div>
      </div>

      {/* 6 Dashboard Widgets Grid (Today's Schedule, Upcoming Travel, My Tasks, Pending Docs, Upcoming Meetings, Notifications) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <TodayScheduleCard />
        <UpcomingTravelCard />
        <MyTasksCard />
        <PendingDocsCard />
        <UpcomingMeetingsCard />
        <NotificationsCard />
      </div>

      {/* Bottom Recent Activities Card with Left-to-Right Transparent Gradient & Temple Skyline */}
      <RecentActivitiesCard />
    </SacredPortalLayout>
  );
}
