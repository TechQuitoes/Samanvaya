"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SacredPillTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
  countVariant?: "default" | "amber" | "rose" | "emerald";
}

export interface SacredPillTabsProps {
  tabs: SacredPillTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function SacredPillTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: SacredPillTabsProps) {
  const getBadgeClass = (
    isActive: boolean,
    variant: SacredPillTabItem["countVariant"] = "default"
  ) => {
    if (isActive) {
      if (variant === "amber") {
        return "bg-amber-100 text-[#174824] font-bold";
      }
      if (variant === "rose") {
        return "bg-rose-100 text-[#174824] font-bold";
      }
      return "bg-white/20 text-white font-bold";
    }

    if (variant === "amber") {
      return "bg-amber-200 text-amber-950 font-bold animate-pulse";
    }
    if (variant === "rose") {
      return "bg-rose-200 text-rose-950 font-bold";
    }
    return "bg-[#174824]/15 text-[#174824] font-bold";
  };

  return (
    <div
      className={`bg-[#faf4e8] border border-[#e5d9c3] p-1 sm:p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto select-none no-scrollbar flex items-center gap-1 shadow-xs ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 sm:flex-initial justify-center rounded-xl px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
              isActive
                ? "bg-[#174824] text-white shadow-sm font-bold"
                : "text-[#5a4836] hover:text-[#174824] hover:bg-[#fffdfa]/60"
            }`}
          >
            {Icon && (
              <Icon
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                  isActive ? "text-amber-300" : "text-[#5a4836]"
                }`}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] transition-colors ${getBadgeClass(
                  isActive,
                  tab.countVariant
                )}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
