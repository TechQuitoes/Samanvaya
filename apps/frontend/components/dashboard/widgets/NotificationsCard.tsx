"use client";

import React from "react";
import { Bell } from "lucide-react";
import ECard from "@/components/ui/ECard";

export interface NotificationItem {
  message: string;
  timeAgo: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { message: "Travel updated to Mumbai", timeAgo: "5m ago" },
  { message: "Documentation pending", timeAgo: "15m ago" },
  { message: "Task assigned to you", timeAgo: "30m ago" },
];

export default function NotificationsCard({
  items = DEFAULT_NOTIFICATIONS,
}: {
  items?: NotificationItem[];
}) {
  return (
    <ECard
      title="Notifications"
      icon={Bell}
      footerAction={{ label: "View All", href: "/dashboard" }}
      className="h-full"
    >
      <div className="space-y-3 pt-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 text-xs sm:text-[13px]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#174824] flex-shrink-0" />
              <span className="font-semibold text-[#2c221e] truncate">
                {item.message}
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
