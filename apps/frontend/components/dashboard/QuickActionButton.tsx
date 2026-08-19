"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface QuickActionButtonProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  onClick?: () => void;
  className?: string;
}

export default function QuickActionButton({
  icon: Icon,
  title,
  onClick,
  className = "",
}: QuickActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center py-3.5 sm:py-4 px-2 sm:px-3 rounded-[20px] sm:rounded-[22px] border border-[#e5d9c3] bg-[#fbf8f0] hover:bg-[#fffdf8] hover:border-[#d4af37]/60 hover:shadow-xs active:scale-95 transition-all duration-200 cursor-pointer w-full max-w-[135px] mx-auto text-center ${className}`}
    >
      {/* Dark Green Circular Icon Badge */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#174824] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 mb-1.5">
        <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
      </div>

      {/* Action Title */}
      <span className="text-xs sm:text-[13px] font-semibold text-[#2c221e] group-hover:text-[#174824] transition-colors truncate max-w-full">
        {title}
      </span>
    </button>
  );
}
