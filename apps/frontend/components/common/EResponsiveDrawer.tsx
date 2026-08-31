"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClasses: Record<DrawerSize, string> = {
  sm: "md:w-[480px] md:max-w-md",
  md: "md:w-[560px] md:max-w-xl",
  lg: "md:w-[640px] md:max-w-2xl",
  xl: "md:w-[760px] md:max-w-3xl",
  full: "md:w-[860px] md:max-w-4xl",
};

interface EResponsiveDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: DrawerSize; // "sm" | "md" | "lg" (default) | "xl"
  showLotusIcon?: boolean;
}

export default function EResponsiveDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "lg",
  showLotusIcon = true,
}: EResponsiveDrawerProps) {
  const desktopWidthClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        {/* Responsive Content: Bottom Sheet on Mobile (<md), Right Side Drawer on Desktop (>=md) */}
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 flex flex-col bg-[#fffdfa] text-[#2c221e] shadow-2xl transition ease-out duration-300 outline-none",
            // 📱 Mobile Styles (< md): Bottom Sheet
            "inset-x-0 bottom-0 max-h-[92vh] rounded-t-[28px] sm:rounded-t-[32px] border-t border-[#e5d9c3]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            // 🖥️ Desktop Styles (>= md): Right Side Slide-Over Drawer
            "md:inset-y-0 md:top-0 md:bottom-0 md:left-auto md:right-0 md:h-screen md:max-h-screen md:rounded-none md:rounded-l-[32px] md:border-t-0 md:border-l md:border-[#e5d9c3]",
            "md:data-[state=open]:slide-in-from-right md:data-[state=closed]:slide-out-to-right",
            desktopWidthClass,
            className
          )}
        >
          {/* 📱 Mobile Drag Handle Indicator */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-12 h-1.5 rounded-full bg-[#cfa35d]/60" />
          </div>

          {/* Sacred Drawer / Sheet Header */}
          {(title || showLotusIcon) && (
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#e5d9c3]/70 bg-[#fbf8f2]/90 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {showLotusIcon && (
                  <div className="relative w-6 h-6 flex-shrink-0 opacity-90">
                    <Image
                      src="/assets/04_lotus_icon_gold.png"
                      alt="Lotus Emblem"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {typeof title === "string" ? (
                    <DialogPrimitive.Title className="font-serif-display text-base sm:text-lg font-bold text-[#174824] truncate">
                      {title}
                    </DialogPrimitive.Title>
                  ) : (
                    title
                  )}
                  {description && (
                    <DialogPrimitive.Description className="text-xs text-[#5a4836] truncate">
                      {description}
                    </DialogPrimitive.Description>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <DialogPrimitive.Close className="w-8 h-8 rounded-full bg-[#f4ede0] hover:bg-[#e8dcbf] text-[#5a4836] hover:text-[#174824] flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#174824]/20 flex-shrink-0">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          )}

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
