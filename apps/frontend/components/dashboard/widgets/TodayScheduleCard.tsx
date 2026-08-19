"use client";

import React from "react";
import ECard from "@/components/ui/ECard";

export interface ScheduleItem {
  time: string;
  title: string;
  isImportant?: boolean;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: "09:00", title: "Temple Meeting", isImportant: true },
  { time: "12:30", title: "Lunch", isImportant: false },
  { time: "16:00", title: "Travel to Mumbai", isImportant: true },
  { time: "19:00", title: "Lecture", isImportant: false },
];

export default function TodayScheduleCard({
  items = DEFAULT_SCHEDULE,
}: {
  items?: ScheduleItem[];
}) {
  return (
    <ECard
      title="Today's Schedule"
      footerAction={{ label: "View All", href: "/calendar" }}
      className="h-full"
    >
      <div className="space-y-3.5 pt-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-xs sm:text-[13px]">
            {/* Time */}
            <span className="w-11 font-medium text-[#5a4836] flex-shrink-0">
              {item.time}
            </span>

            {/* Bullet indicator */}
            <div className="flex items-center justify-center w-3 flex-shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isImportant ? "bg-[#174824]" : "bg-[#d4af37]"
                }`}
              />
            </div>

            {/* Title */}
            <span className="font-semibold text-[#2c221e] truncate flex-1">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </ECard>
  );
}
