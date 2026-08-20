"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import QuickActionButton from "./QuickActionButton";

export interface MobileActionItem {
  title: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  href: string;
}

export interface MobileQuickActionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: MobileActionItem[];
  title?: string;
  onActionClick?: (href: string) => void;
}

export default function MobileQuickActionsSheet({
  open,
  onOpenChange,
  actions,
  title = "More Quick Actions",
  onActionClick,
}: MobileQuickActionsSheetProps) {
  const router = useRouter();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    if (onActionClick) {
      onActionClick(href);
    } else {
      router.push(href);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[28px] border-t border-[#e5d9c3] bg-[#fbf8f0] p-6 max-h-[80vh] overflow-y-auto"
      >
        <SheetHeader className="mb-4 text-left">
          <SheetTitle className="text-base font-bold text-[#174824]">
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-4 gap-3 pt-1">
          {actions.map((action) => (
            <QuickActionButton
              key={action.title}
              title={action.title}
              icon={action.icon}
              onClick={() => handleSelect(action.href)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
