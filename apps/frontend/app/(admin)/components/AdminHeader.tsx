"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Bell, HelpCircle, LogOut } from "lucide-react";
import DataManager from "@/lib/data-manager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  pendingCount: number;
}

export default function AdminHeader({ onToggleSidebar, pendingCount }: AdminHeaderProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("Giriraj Das");
  const [userRole, setUserRole] = useState("Leader");

  useEffect(() => {
    const currentUser = DataManager.getUser();
    if (currentUser?.name) {
      setUserName(currentUser.name);
    }
    if (currentUser?.role) {
      setUserRole(currentUser.role);
    }
  }, []);

  const handleLogout = () => {
    DataManager.cleanAll();
    router.push("/login");
  };

  return (
    <header className="w-full bg-transparent border-none shadow-none px-4 sm:px-6 pt-3 pb-2 sm:py-4">
      {/* ─── MOBILE HEADER (< lg) ─── */}
      <div className="lg:hidden flex flex-col gap-3.5">
        {/* Top Bar: Hamburger, Samanvaya Logo+Title, Notification Bell */}
        <div className="flex items-center justify-between">
          {/* Hamburger Menu */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
            className="p-1.5 -ml-1 text-[#2c221e] hover:text-[#174824] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src="/assets/04_lotus_icon_gold.png"
                alt="Lotus Emblem"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif-display text-xl font-bold text-[#174824] tracking-tight">
              Samanvaya
            </span>
          </div>

          {/* Right Notification Bell with Badge */}
          <button
            type="button"
            className="relative p-1.5 -mr-1 text-[#2c221e] hover:text-[#174824] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#c0392b] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {pendingCount > 0 ? pendingCount : 1}
            </span>
          </button>
        </div>

        {/* Greeting Section below Top Bar on Mobile */}
        <div className="space-y-0.5 pt-0.5">
          <h1 className="font-serif-display text-lg font-bold text-[#174824] flex items-center gap-1.5">
            <span>Hare Krishna, {userName}</span>
            <span className="text-base">🙏</span>
          </h1>
          <p className="text-xs text-[#5a4836] font-medium tracking-wide">
            All Glories to Srila Prabhupada
          </p>
        </div>
      </div>

      {/* ─── DESKTOP HEADER (>= lg) ─── */}
      <div className="hidden lg:flex w-full items-center justify-between gap-4">
        {/* Left Side: Devotional Greeting & Tagline */}
        <div className="space-y-0.5 min-w-0">
          <h1 className="font-serif-display text-2xl font-bold text-[#174824] flex items-center gap-2 truncate">
            <span>Hare Krishna, {userName}</span>
            <span className="text-xl flex-shrink-0">🙏</span>
          </h1>
          <p className="text-sm text-[#4a3e31] font-medium tracking-wide">
            Welcome to Samanvaya
          </p>
          <p className="text-xs text-[#8c7865] font-medium tracking-wide">
            Organise &bull; Coordinate &bull; Serve
          </p>
        </div>

        {/* Right Side: Notification Bell, Help Icon, Profile Avatar */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notifications Button */}
          <button
            type="button"
            className="relative w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-[#2c221e] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#2c221e]" />
            {pendingCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Help / Support Icon */}
          <button
            type="button"
            className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-[#2c221e] transition-colors cursor-pointer"
            aria-label="Help and Support"
          >
            <HelpCircle className="w-5 h-5 text-[#2c221e]" />
          </button>

          {/* Leader Profile Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-sm hover:ring-2 hover:ring-[#174824]/30 transition-all flex-shrink-0">
                <Image
                  src="/assets/01_desktop_temple_background_banner.png"
                  alt="Leader Profile Avatar"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 bg-[#fcfaf5] border border-[#e5d9c3] shadow-lg">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-xs font-bold text-[#174824]">{userName}</p>
                <p className="text-[11px] text-[#8c7865] font-medium">{userRole}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#e5d9c3]/60 my-1" />
              <DropdownMenuItem
                onClick={() => router.push("/leader-profile")}
                className="rounded-xl text-xs font-semibold text-[#2c221e] hover:bg-[#faf4e8] cursor-pointer"
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

