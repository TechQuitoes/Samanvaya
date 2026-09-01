"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SacredPageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export default function SacredPageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  className = "",
}: SacredPageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      {/* Title & Icon Block */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-2xl font-bold text-[#174824] truncate tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] sm:text-sm text-[#5a4836] font-medium hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions Bar (Buttons, Search, etc.) */}
      {actions && (
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
