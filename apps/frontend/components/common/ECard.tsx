"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ECardVariant = "sacred" | "white" | "subtle" | "outline";
export type ECardPadding = "none" | "sm" | "md" | "lg";

export interface ECardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ECardVariant;
  padding?: ECardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  spaceY?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  headerDivider?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
}

const variantStyles: Record<ECardVariant, string> = {
  sacred: "bg-[#faf4e8] border-[#e5d9c3] text-[#2c221e]",
  white: "bg-white border-[#e5d9c3] text-[#2c221e]",
  subtle: "bg-[#fcfaf5] border-[#e5d9c3] text-[#2c221e]",
  outline: "bg-transparent border-[#e5d9c3] text-[#2c221e]",
};

const paddingStyles: Record<ECardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-6 sm:p-8",
};

export const ECard = forwardRef<HTMLDivElement, ECardProps>(
  (
    {
      variant = "sacred",
      padding = "md",
      hoverable = false,
      clickable = false,
      spaceY = true,
      title,
      subtitle,
      icon,
      headerAction,
      headerDivider = false,
      headerClassName,
      bodyClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasHeader = title || subtitle || icon || headerAction;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[24px] sm:rounded-[28px] border shadow-xs transition-all",
          variantStyles[variant],
          paddingStyles[padding],
          spaceY && "space-y-4",
          hoverable && "hover:shadow-md hover:border-[#174824]/30",
          clickable && "cursor-pointer hover:bg-white active:scale-[0.99]",
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              headerDivider && "border-b border-[#e5d9c3]/60 pb-3",
              headerClassName
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              {icon && <span className="shrink-0 flex items-center">{icon}</span>}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-base font-bold text-[#174824] truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-[#8c7865] font-medium truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        )}

        {hasHeader ? (
          <div className={cn(spaceY && "space-y-4", bodyClassName)}>
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

ECard.displayName = "ECard";

export const ECardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-4 border-b border-[#e5d9c3]/60 pb-3",
      className
    )}
    {...props}
  />
));
ECardHeader.displayName = "ECardHeader";

export const ECardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-bold text-[#174824] flex items-center gap-2", className)}
    {...props}
  />
));
ECardTitle.displayName = "ECardTitle";

export const ECardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props} />
));
ECardContent.displayName = "ECardContent";

export const ECardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end gap-2 pt-3 border-t border-[#e5d9c3]/50", className)}
    {...props}
  />
));
ECardFooter.displayName = "ECardFooter";

export default ECard;
