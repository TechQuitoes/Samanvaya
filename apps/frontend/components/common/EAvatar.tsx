"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type EAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeClasses: Record<EAvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-xs",
  lg: "w-10 h-10 text-sm",
  xl: "w-11 h-11 sm:w-12 sm:h-12 text-base",
  "2xl": "w-14 h-14 sm:w-16 sm:h-16 text-lg",
};

export interface EAvatarProps {
  /** Image URL or undefined */
  src?: string | null;
  /** Full name or string to extract initial(s) from */
  name?: string | null;
  /** Custom fallback text (defaults to first letter of name or "?") */
  fallbackText?: string;
  /** Size preset: xs (24px), sm (32px), md (36px), lg (40px), xl (48px), 2xl (64px) */
  size?: EAvatarSize;
  /** Border style variant */
  variant?: "sacred" | "gold" | "muted" | "none";
  /** Additional classes applied to root Avatar */
  className?: string;
  /** Additional classes applied to AvatarImage */
  imageClassName?: string;
  /** Additional classes applied to AvatarFallback */
  fallbackClassName?: string;
}

export default function EAvatar({
  src,
  name,
  fallbackText,
  size = "md",
  variant = "sacred",
  className,
  imageClassName,
  fallbackClassName,
}: EAvatarProps) {
  // Extract initial (e.g. "Giriraj Das" -> "G", "Devotee" -> "D")
  const computedFallback = React.useMemo(() => {
    if (fallbackText) return fallbackText;
    if (name && name.trim().length > 0) {
      return name.trim().charAt(0).toUpperCase();
    }
    return "D";
  }, [fallbackText, name]);

  const variantBorderClass = {
    sacred: "border border-[#174824]/20 shadow-2xs",
    gold: "border-2 border-[#d4af37] shadow-sm",
    muted: "border border-[#e5d9c3] shadow-2xs",
    none: "",
  }[variant];

  return (
    <Avatar
      className={cn(
        "flex-shrink-0 select-none overflow-hidden",
        sizeClasses[size],
        variantBorderClass,
        className
      )}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={name || "User Avatar"}
          className={cn("object-cover object-center", imageClassName)}
        />
      )}
      <AvatarFallback
        className={cn(
          "bg-[#174824]/10 text-[#174824] font-bold flex items-center justify-center",
          fallbackClassName
        )}
      >
        {computedFallback}
      </AvatarFallback>
    </Avatar>
  );
}
