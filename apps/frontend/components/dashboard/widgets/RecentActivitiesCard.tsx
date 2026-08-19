"use client";

import React from "react";
import Image from "next/image";

export interface ActivityItem {
  text: string;
  timeAgo: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { text: "Giriraj Das updated Journal for 28 Apr", timeAgo: "10 mins ago" },
  { text: "Meeting with ISKCON Pune added", timeAgo: "28 mins ago" },
];

export default function RecentActivitiesCard({
  activities = DEFAULT_ACTIVITIES,
}: {
  activities?: ActivityItem[];
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#e5d9c3] p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-[#d4af37]/50 min-h-[120px] flex flex-col justify-center">
      {/* Background Panoramic Temple Illustration on Right */}
      <div className="absolute inset-y-0 right-0 w-3/4 sm:w-2/3 pointer-events-none overflow-hidden opacity-40 mix-blend-multiply z-0">
        <Image
          src="/assests/footer_bg001.jpg"
          alt="Temple Skyline"
          fill
          className="object-cover object-right"
        />
      </div>

      {/* Left-to-Right Transparent Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f0] via-[#fbf8f0]/90 via-40% to-transparent pointer-events-none z-[1]" />

      {/* Lotus Motif on Far Right */}
      <div className="absolute right-4 bottom-3 sm:bottom-4 w-9 h-9 sm:w-10 sm:h-10 opacity-75 pointer-events-none z-10">
        <Image
          src="/assets/04_lotus_icon_gold.png"
          alt="Lotus Emblem"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Card Content */}
      <div className="relative z-10 space-y-3 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#174824] flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <div className="relative w-3.5 h-3.5">
              <Image
                src="/assets/04_lotus_icon_gold.png"
                alt=""
                fill
                className="object-contain filter brightness-200"
              />
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#2c221e] tracking-tight">
            Recent Activities
          </h3>
        </div>

        {/* Activity Bullets */}
        <div className="space-y-2 pl-1">
          {activities.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs sm:text-[13px] text-[#2c221e]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#174824] flex-shrink-0" />
              <span className="font-medium">{item.text}</span>
              <span className="text-[#8c7865] font-medium flex items-center gap-1.5 flex-shrink-0">
                <span>&bull;</span>
                <span>{item.timeAgo}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
