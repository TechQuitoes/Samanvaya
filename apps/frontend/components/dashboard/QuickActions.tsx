"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Calendar,
  BookOpen,
  FileText,
  CheckSquare,
  Heart,
  Users,
  Contact,
  Archive,
  BarChart3,
  UsersRound,
  Settings,
  MoreHorizontal,
  LucideIcon,
} from "lucide-react";
import QuickActionButton from "./QuickActionButton";
import MobileQuickActionsSheet from "./MobileQuickActionsSheet";
import { usePermissions } from "@/hooks/usePermissions";

export interface ActionItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
}

export const ALL_QUICK_ACTIONS: ActionItem[] = [
  { id: "travel", title: "Travel", icon: Plane, href: "/travel" },
  { id: "calendar", title: "Calendar", icon: Calendar, href: "/calendar" },
  { id: "journal", title: "Journal", icon: BookOpen, href: "/journal" },
  { id: "documentation", title: "Documentation", icon: FileText, href: "/documentation" },
  { id: "tasks", title: "Tasks", icon: CheckSquare, href: "/tasks" },
  { id: "health", title: "Health", icon: Heart, href: "/health" },
  { id: "meetings", title: "Meetings", icon: Users, href: "/meetings" },
  { id: "contacts", title: "Contacts", icon: Contact, href: "/contacts" },
  { id: "archival", title: "Archival", icon: Archive, href: "/archival" },
  { id: "reports", title: "Reports", icon: BarChart3, href: "/reports" },
  { id: "users", title: "Users", icon: UsersRound, href: "/admin/approvals" },
  { id: "settings", title: "Settings", icon: Settings, href: "/settings" },
];

export default function QuickActions() {
  const router = useRouter();
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const { isSuperAdmin, hasModuleAccess } = usePermissions();

  // 1. Dynamic permission filtering (matching Sidebar logic)
  const allowedActions = ALL_QUICK_ACTIONS.filter((action) => {
    if (isSuperAdmin) {
      return true;
    }
    return hasModuleAccess(action.id);
  });

  if (allowedActions.length === 0) {
    return null;
  }

  // Mobile split: first 3 items + More button (if > 4 items)
  const showMobileMore = allowedActions.length > 4;
  const mobilePrimaryActions = showMobileMore ? allowedActions.slice(0, 3) : allowedActions;
  const mobileMoreActions = showMobileMore ? allowedActions.slice(3) : [];

  // Desktop split: up to 7 items + More button (if > 8 items), else all
  const showDesktopMore = allowedActions.length > 8;
  const desktopPrimaryActions = showDesktopMore ? allowedActions.slice(0, 7) : allowedActions;
  const desktopMoreActions = showDesktopMore ? allowedActions.slice(7) : [];

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm sm:text-base font-semibold text-[#2c221e]">
        Quick Actions
      </h3>

      {/* 📱 Mobile: 1 Row (< md) */}
      <div className="grid grid-cols-4 md:hidden gap-2 sm:gap-3">
        {mobilePrimaryActions.map((action) => (
          <QuickActionButton
            key={action.id}
            title={action.title}
            icon={action.icon}
            onClick={() => router.push(action.href)}
          />
        ))}
        {showMobileMore && (
          <QuickActionButton
            title="More"
            icon={MoreHorizontal}
            onClick={() => setMoreActionsOpen(true)}
          />
        )}
      </div>

      {/* 💻 Desktop: Dynamic Grid (>= md) */}
      <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {desktopPrimaryActions.map((action) => (
          <QuickActionButton
            key={action.id}
            title={action.title}
            icon={action.icon}
            onClick={() => router.push(action.href)}
          />
        ))}
        {showDesktopMore && (
          <QuickActionButton
            title="More"
            icon={MoreHorizontal}
            onClick={() => setMoreActionsOpen(true)}
          />
        )}
      </div>

      {/* Mobile & Desktop More Actions Bottom Sheet */}
      <MobileQuickActionsSheet
        open={moreActionsOpen}
        onOpenChange={setMoreActionsOpen}
        actions={showMobileMore ? mobileMoreActions : desktopMoreActions}
      />
    </div>
  );
}
