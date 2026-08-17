"use client";

import { useRouter } from "next/navigation";
import { Menu, Bell, Globe, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataManager from "@/lib/data-manager";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  pendingCount: number;
}

export default function AdminHeader({ onToggleSidebar, pendingCount }: AdminHeaderProps) {
  const router = useRouter();
  const currentUser = DataManager.getUser();
  const adminName = currentUser?.name || "Admin";

  const handleLogout = () => {
    DataManager.cleanAll();
    router.push("/login");
  };

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2 space-y-3 sm:space-y-4">
      {/* Top Bar Row: Left Menu Button --- Right Controls (EN, Bell, Logout) */}
      <div className="flex items-center justify-between">
        {/* Left: Hamburger Menu Button (Visible ONLY on Mobile/Tablet < lg, hidden on Desktop >= lg) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/90 backdrop-blur-md border border-[#e5d9c3] shadow-xs flex items-center justify-center text-[#174824] hover:bg-white transition-all cursor-pointer flex-shrink-0"
        >
          <Menu className="w-6 h-6 text-[#174824]" />
        </button>

        {/* Right: Language Pill, Notification Bell & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#e5d9c3] shadow-xs flex items-center gap-1.5 text-xs font-semibold text-[#2c221e] hover:bg-white transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#174824]" />
            <span>EN</span>
            <ChevronDown className="w-3 h-3 text-[#5a4836]" />
          </button>

          <button
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#e5d9c3] shadow-xs flex items-center justify-center text-[#174824] hover:bg-white transition-all relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#174824]" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#5a4836] hover:text-red-700 hover:bg-red-50 gap-1.5 text-xs font-semibold rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Devotional Greeting Banner (Placed BELOW Top Bar, Left-Aligned - Exactly as in Screenshot 2!) */}
      <div className="text-left space-y-0.5 pt-1">
        <h1 className="text-xl sm:text-2xl font-bold text-[#174824] flex items-center gap-2">
          <span>Hare Krishna, {adminName}</span>
          <span className="text-lg sm:text-xl">🙏</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5a4836] font-semibold tracking-wide">
          All Glories to Srila Prabhupada
        </p>
      </div>
    </header>
  );
}
