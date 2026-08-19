"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";

export interface ECardAction {
  label?: string;
  href?: string;
  onClick?: () => void;
}

export interface ECardProps {
  title: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconColor?: string;
  badge?: string | number;
  footerAction?: ECardAction;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function ECard({
  title,
  icon: Icon,
  iconColor = "text-[#174824]",
  badge,
  footerAction,
  headerAction,
  children,
  className = "",
  contentClassName = "",
}: ECardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#e5d9c3] bg-[#fbf8f0] p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-[#d4af37]/50 ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div className="p-1 rounded-lg text-[#174824] flex-shrink-0">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          )}
          <h3 className="text-sm sm:text-base font-bold text-[#2c221e] tracking-tight truncate">
            {title}
          </h3>
          {badge !== undefined && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-[#174824]">
              {badge}
            </span>
          )}
        </div>

        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </div>

      {/* Card Content Area */}
      <div className={`flex-1 ${contentClassName}`}>{children}</div>

      {/* Card Footer Action (e.g. View All / View Details) */}
      {footerAction && (
        <div className="pt-3 mt-3 flex items-center justify-end">
          {footerAction.href ? (
            <Link
              href={footerAction.href}
              className="text-xs sm:text-[13px] font-semibold text-[#174824] hover:text-[#0f3018] hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{footerAction.label || "View All"}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={footerAction.onClick}
              className="text-xs sm:text-[13px] font-semibold text-[#174824] hover:text-[#0f3018] hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{footerAction.label || "View All"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
