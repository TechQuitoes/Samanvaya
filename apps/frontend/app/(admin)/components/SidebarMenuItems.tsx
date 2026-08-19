"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  Calendar,
  FileText,
  BookOpen,
  CheckSquare,
  Heart,
  Users,
  Contact,
  Archive,
  BarChart3,
  UsersRound,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Travel",
    href: "/travel",
    icon: Plane,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Documentation",
    href: "/documentation",
    icon: FileText,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Health",
    href: "/health",
    icon: Heart,
  },
  {
    title: "Meetings",
    href: "/meetings",
    icon: Users,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Contact,
  },
  {
    title: "Archival",
    href: "/archival",
    icon: Archive,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/approvals",
    icon: UsersRound,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarMenuItemsProps {
  onItemClick?: () => void;
}

export default function SidebarMenuItems({ onItemClick }: SidebarMenuItemsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className="space-y-1 py-1">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));

        return (
          <button
            key={item.title}
            type="button"
            onClick={() => handleNavigate(item.href)}
            className={`group w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-gradient-to-b from-[#877839]/90 to-[#6d602b]/95 text-white shadow-md border border-[#c4b35e]/30 font-semibold backdrop-blur-xs"
                : "text-emerald-100/90 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                isActive
                  ? "text-white scale-105"
                  : "text-emerald-200/80 group-hover:text-white group-hover:scale-105"
              }`}
            />
            <span className="tracking-wide text-left flex-1">{item.title}</span>

            {item.badge !== undefined && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-[#174824]">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
