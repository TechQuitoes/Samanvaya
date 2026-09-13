"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type ESkeletonVariant = "default" | "circular" | "rectangular" | "card";

export interface ESkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  containerClassName?: string;
  variant?: ESkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const variantClasses: Record<ESkeletonVariant, string> = {
  default: "rounded-xl",
  circular: "rounded-full",
  rectangular: "rounded-md",
  card: "rounded-2xl",
};

export function ESkeleton({
  count = 1,
  containerClassName,
  variant = "default",
  width,
  height,
  className,
  style,
  ...props
}: ESkeletonProps) {
  const itemStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  const baseClasses = cn(
    "animate-pulse bg-[#e5d9c3]/50",
    variantClasses[variant],
    className
  );

  // Single item
  if (count <= 1) {
    return <div className={baseClasses} style={itemStyle} {...props} />;
  }

  // Multiple items with internal mapping
  const items = Array.from({ length: count }, (_, idx) => (
    <div key={idx} className={baseClasses} style={itemStyle} {...props} />
  ));

  if (containerClassName) {
    return <div className={containerClassName}>{items}</div>;
  }

  return <>{items}</>;
}

export default ESkeleton;
