"use client";

import React from "react";
import { Clock } from "lucide-react";
import ECard from "@/components/ui/ECard";

export interface MeetingItem {
  time: string;
  title: string;
}

const DEFAULT_MEETINGS: MeetingItem[] = [
  { time: "12:00", title: "ISKCON Mumbai Team" },
  { time: "16:00", title: "Travel Review" },
  { time: "20:00", title: "Leadership Call" },
];

export default function UpcomingMeetingsCard({
  items = DEFAULT_MEETINGS,
}: {
  items?: MeetingItem[];
}) {
  return (
    <ECard
      title="Upcoming Meetings"
      icon={Clock}
      footerAction={{ label: "View All", href: "/meetings" }}
      className="h-full"
    >
      <div className="space-y-3 pt-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-xs sm:text-[13px]">
            {/* Bullet indicator */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#174824] flex-shrink-0" />

            {/* Time */}
            <span className="w-11 font-medium text-[#5a4836] flex-shrink-0">
              {item.time}
            </span>

            {/* Meeting Name */}
            <span className="font-semibold text-[#2c221e] truncate flex-1">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </ECard>
  );
}
