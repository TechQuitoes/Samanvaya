"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type EModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

const sizeClasses: Record<EModalSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-3xl",
};

export interface EModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: EModalSize;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
}

export function EModal({
  open,
  onOpenChange,
  title,
  subtitle,
  description,
  icon,
  children,
  footer,
  size = "sm",
  className,
  headerClassName,
  footerClassName,
  showCloseButton = true,
}: EModalProps) {
  const resolvedSubtitle = subtitle || description;
  const resolvedSizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs dialog-overlay"
          )}
        />

        {/* Modal Dialog Content */}
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[92vw] sm:w-full translate-x-[-50%] translate-y-[-50%] rounded-[24px] bg-[#fffdfa] border border-[#e5d9c3] p-6 shadow-2xl modal-content outline-none focus:outline-none",
            resolvedSizeClass,
            className
          )}
        >
          {/* Header */}
          {(title || resolvedSubtitle) && (
            <div className={cn("space-y-1 mb-2", headerClassName)}>
              {title && (
                <DialogPrimitive.Title className="text-base sm:text-lg font-bold text-[#174824] flex items-center gap-2">
                  {icon && <span className="shrink-0 flex items-center">{icon}</span>}
                  <span>{title}</span>
                </DialogPrimitive.Title>
              )}
              {resolvedSubtitle && (
                <DialogPrimitive.Description className="text-[11px] sm:text-xs text-[#8c7865] font-medium">
                  {resolvedSubtitle}
                </DialogPrimitive.Description>
              )}
            </div>
          )}

          {/* Body */}
          <div className="w-full">{children}</div>

          {/* Footer */}
          {footer && (
            <div className={cn("pt-3 w-full", footerClassName)}>{footer}</div>
          )}

          {/* Close Button */}
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-[#8c7865] hover:text-[#174824] hover:bg-black/5 transition-colors cursor-pointer outline-none focus:outline-none">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default EModal;
