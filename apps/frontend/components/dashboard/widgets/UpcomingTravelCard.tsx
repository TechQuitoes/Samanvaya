"use client";

import React from "react";
import ECard from "@/components/ui/ECard";

export interface TravelStop {
  location: string;
}

const DEFAULT_STOPS: TravelStop[] = [
  { location: "Ahmedabad" },
  { location: "Mumbai" },
  { location: "Mayapur" },
];

export default function UpcomingTravelCard({
  stops = DEFAULT_STOPS,
  dateRange = "2 May 2024 – 6 May 2024",
}: {
  stops?: TravelStop[];
  dateRange?: string;
}) {
  return (
    <ECard
      title="Upcoming Travel"
      footerAction={{ label: "View Details", href: "/travel" }}
      className="h-full"
    >
      <div className="space-y-4 pt-1">
        {/* Timeline Path */}
        <div className="relative pl-1 space-y-4">
          {stops.map((stop, index) => (
            <div key={index} className="relative flex items-center gap-4">
              {/* Connector line */}
              {index < stops.length - 1 && (
                <div className="absolute left-[7px] top-[14px] bottom-[-16px] w-[1.5px] border-l-2 border-dashed border-[#c4b35e]" />
              )}

              {/* Node Bullet Ring */}
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#174824] flex items-center justify-center flex-shrink-0 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#174824]" />
              </div>

              {/* Stop Name */}
              <span className="text-xs sm:text-[13px] font-semibold text-[#2c221e]">
                {stop.location}
              </span>
            </div>
          ))}
        </div>

        {/* Date Range Subtitle */}
        <p className="text-[11px] sm:text-xs font-medium text-[#8c7865] pl-8">
          {dateRange}
        </p>
      </div>
    </ECard>
  );
}
