"use client";

import React from "react";
import { FileText } from "lucide-react";
import ECard from "@/components/ui/ECard";

export interface ActivityItem {
  text: string;
  timeAgo: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { text: "Giriraj Das updated Journal for 28 Apr", timeAgo: "10m ago" },
  { text: "Meeting with ISKCON Pune added", timeAgo: "25 mins ago" },
  { text: "Travel Plan updated: Mumbai Visit", timeAgo: "1h ago" },
];

export default function RecentActivitiesCard({
  activities = DEFAULT_ACTIVITIES,
}: {
  activities?: ActivityItem[];
}) {
  return (
    <ECard
      title="Recent Activities"
      icon={FileText}
      footerAction={{ label: "View All", href: "/journal" }}
      className="h-full"
    >
      <div className="space-y-4 pt-1">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 text-xs sm:text-[13px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Green glowing bullet */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#174824]/20 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#174824]" />
              </div>
              <span className="font-semibold text-[#2c221e] truncate">
                {item.text}
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#8c7865] flex-shrink-0">
              {item.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </ECard>
  );
}
