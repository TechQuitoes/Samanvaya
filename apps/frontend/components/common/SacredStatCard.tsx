"use client";

import React from "react";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import ECard from "@/components/common/ECard";

export type SacredStatVariant = "default" | "emerald" | "amber" | "rose" | "blue" | "gold";

export interface SacredStatCardItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: SacredStatVariant;
  pulsingIcon?: boolean;
  onClick?: () => void;
}

export interface SacredStatCardProps extends SacredStatCardItem {
  isLoading?: boolean;
  className?: string;
}

export function SacredStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "emerald",
  pulsingIcon = false,
  isLoading = false,
  onClick,
  className = "",
}: SacredStatCardProps) {
  const getStyles = () => {
    switch (variant) {
      case "amber":
      case "gold":
        return {
          border: "border-amber-300/80",
          valueColor: "text-amber-900",
          subColor: "text-amber-800",
          iconBg: "bg-amber-100/90 border-amber-300/60",
          iconColor: "text-amber-700",
        };
      case "rose":
        return {
          border: "border-rose-200/80",
          valueColor: "text-rose-800",
          subColor: "text-rose-700",
          iconBg: "bg-rose-100/90 border-rose-300/60",
          iconColor: "text-rose-700",
        };
      case "blue":
        return {
          border: "border-blue-200/80",
          valueColor: "text-blue-900",
          subColor: "text-blue-700",
          iconBg: "bg-blue-100/90 border-blue-300/60",
          iconColor: "text-blue-700",
        };
      case "default":
      case "emerald":
      default:
        return {
          border: "border-[#e5d9c3]",
          valueColor: "text-[#174824]",
          subColor: "text-[#5a4836]",
          iconBg: "bg-[#174824]/10 border-[#174824]/20",
          iconColor: "text-[#174824]",
        };
    }
  };

  const styles = getStyles();

  return (
    <ECard
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl sm:rounded-[28px] p-2.5 sm:p-5 border ${
        styles.border
      } bg-[#faf4e8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all ${
        onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : ""
      } ${className}`}
    >
      {/* Corner Leaf Illustration Accent */}
      <div className="absolute top-0 right-0 w-12 sm:w-20 h-12 sm:h-20 pointer-events-none opacity-40 sm:opacity-60">
        <Image
          src="/image-assets/rightSideLeaf.png"
          alt="Leaf Accent"
          fill
          className="object-contain object-top-right"
        />
      </div>

      {/* Text Info */}
      <div className="space-y-0.5 sm:space-y-1 relative z-10 min-w-0">
        <p className="text-[9px] sm:text-xs font-bold text-[#8c7865] uppercase tracking-wider truncate">
          {title}
        </p>
        <p className={`text-xl sm:text-3xl font-bold ${styles.valueColor}`}>
          {isLoading ? "—" : value}
        </p>
        {subtitle && (
          <p className={`text-[9px] sm:text-xs font-semibold truncate hidden xs:block ${styles.subColor}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Icon Badge */}
      <div
        className={`p-1.5 sm:p-3.5 rounded-lg sm:rounded-2xl border shadow-xs relative z-10 flex-shrink-0 ${
          styles.iconBg
        }`}
      >
        <Icon
          className={`w-3.5 h-3.5 sm:w-6 sm:h-6 ${styles.iconColor} ${
            pulsingIcon ? "animate-pulse" : ""
          }`}
        />
      </div>
    </ECard>
  );
}

export interface SacredStatCardsGroupProps {
  cards: SacredStatCardItem[];
  isLoading?: boolean;
  className?: string;
}

export function SacredStatCardsGroup({
  cards,
  isLoading = false,
  className = "",
}: SacredStatCardsGroupProps) {
  const colClass =
    cards.length === 2
      ? "grid-cols-2"
      : cards.length === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-2 sm:gap-4 ${className}`}>
      {cards.map((card, idx) => (
        <SacredStatCard key={idx} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}

export default SacredStatCard;
