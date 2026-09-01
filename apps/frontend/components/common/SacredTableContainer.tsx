"use client";

import React from "react";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

export interface SacredTableContainerProps {
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
  className?: string;
  showLeafAccent?: boolean;
}

export default function SacredTableContainer({
  children,
  isEmpty = false,
  emptyTitle = "No records found",
  emptyDescription = "There are currently no records available in this section.",
  emptyIcon: EmptyIcon,
  emptyAction,
  className = "",
  showLeafAccent = true,
}: SacredTableContainerProps) {
  return (
    <div
      className={`bg-[#faf4e8] border border-[#e5d9c3] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative ${className}`}
    >
      {/* Corner Leaf Accent */}
      {showLeafAccent && (
        <div className="absolute top-0 right-0 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none opacity-30 sm:opacity-40 z-0">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Leaf Accent"
            fill
            className="object-contain object-top-right"
          />
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center relative z-10 space-y-3">
          {EmptyIcon && (
            <div className="p-4 rounded-2xl bg-[#174824]/10 border border-[#174824]/20 shadow-xs mb-1">
              <EmptyIcon className="w-8 h-8 text-[#174824]" />
            </div>
          )}
          <h3 className="text-base sm:text-lg font-bold text-[#174824]">
            {emptyTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#5a4836] max-w-md font-medium leading-relaxed">
            {emptyDescription}
          </p>

          {emptyAction && <div className="pt-2">{emptyAction}</div>}

          <div className="relative w-6 h-6 pt-3 opacity-60">
            <Image
              src="/assests/flower-icon.png"
              alt="Lotus Emblem"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}
