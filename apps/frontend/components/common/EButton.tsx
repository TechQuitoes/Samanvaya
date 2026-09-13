"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type EButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost"
  | "sacred-primary"
  | "sacred-outline";

export type EButtonSize = "sm" | "md" | "lg" | "icon";

export interface EButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: EButtonVariant;
  size?: EButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showLotusIcon?: boolean;
  fullWidth?: boolean;
  href?: string;
}

const variantClasses: Record<EButtonVariant, string> = {
  primary:
    "bg-[#174824] hover:bg-[#12391c] text-white border border-transparent shadow-md shadow-emerald-950/15 active:bg-[#0e2c16]",
  "sacred-primary":
    "bg-[#174824] hover:bg-[#12391c] text-white border border-transparent shadow-md shadow-emerald-950/15 active:bg-[#0e2c16]",
  secondary:
    "bg-[#f4ede4] hover:bg-[#ebdccb] text-[#2c221e] border border-[#e2d5c3] shadow-xs active:bg-[#e4d3bf]",
  outline:
    "bg-white hover:bg-[#174824]/5 text-[#174824] border border-[#e5d9c3] hover:border-[#174824] shadow-xs active:bg-[#174824]/10",
  "sacred-outline":
    "bg-white hover:bg-amber-50/50 text-[#b88636] border border-[#cfa35d] hover:border-[#b88636] shadow-xs active:bg-amber-100/40",
  destructive:
    "bg-red-600 hover:bg-red-700 text-white border border-transparent shadow-md shadow-red-950/15 active:bg-red-800",
  ghost:
    "bg-transparent hover:bg-amber-900/5 text-[#2c221e] border border-transparent active:bg-amber-900/10",
};

const sizeClasses: Record<EButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5",
  md: "h-12 px-5 text-sm rounded-xl gap-2",
  lg: "h-14 px-6 text-base rounded-xl gap-2.5",
  icon: "w-11 h-11 p-0 rounded-xl justify-center",
};

const EButton = forwardRef<HTMLButtonElement, EButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      showLotusIcon = false,
      fullWidth = false,
      href,
      disabled,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const isActuallyDisabled = disabled || isLoading;

    // Render the internal content (spinner, icons, lotus emblem, text)
    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <Loader2
              className={cn(
                "animate-spin shrink-0",
                size === "sm" ? "w-4 h-4" : "w-5 h-5"
              )}
            />
            <span>{loadingText || children || "Loading..."}</span>
          </>
        );
      }

      return (
        <>
          {showLotusIcon && (
            <div
              className={cn(
                "relative shrink-0 flex items-center justify-center",
                size === "sm" ? "w-4 h-4" : "w-5 h-5"
              )}
            >
              <Image
                src="/image-assets/04_lotus_icon_gold.svg"
                alt="Lotus"
                width={size === "sm" ? 16 : 20}
                height={size === "sm" ? 16 : 20}
                className="object-contain brightness-200"
              />
            </div>
          )}

          {!showLotusIcon && leftIcon && (
            <span className="shrink-0 flex items-center">{leftIcon}</span>
          )}

          {children && <span>{children}</span>}

          {rightIcon && (
            <span className="shrink-0 flex items-center">{rightIcon}</span>
          )}
        </>
      );
    };

    const baseClasses =
      "inline-flex items-center justify-center font-semibold transition-all select-none cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174824]/30";

    const resolvedVariant = variantClasses[variant] || variantClasses.primary;
    const resolvedSize = sizeClasses[size] || sizeClasses.md;

    // When an href is provided, render Next Link directly
    if (href) {
      return (
        <Link
          href={isActuallyDisabled ? "#" : href}
          aria-disabled={isActuallyDisabled}
          onClick={(e) => {
            if (isActuallyDisabled) {
              e.preventDefault();
              return;
            }
            if (onClick) {
              onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
            }
          }}
          className={cn(
            baseClasses,
            resolvedVariant,
            resolvedSize,
            fullWidth && "w-full",
            isActuallyDisabled &&
              "opacity-50 pointer-events-none cursor-not-allowed",
            className
          )}
        >
          {renderContent()}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isActuallyDisabled}
        onClick={onClick}
        className={cn(
          baseClasses,
          resolvedVariant,
          resolvedSize,
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

EButton.displayName = "EButton";

export { EButton };
export default EButton;
