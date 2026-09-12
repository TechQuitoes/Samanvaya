"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Bell, HelpCircle, LogOut, UserCircle } from "lucide-react";
import DataManager from "@/lib/data-manager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NotificationBell from "@/components/notifications/NotificationBell";
import EAvatar from "@/components/common/EAvatar";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  pendingCount?: number;
  showGreeting?: boolean;
}

export default function AdminHeader({
  onToggleSidebar,
  showGreeting = true,
}: AdminHeaderProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("Giriraj Das");
  const [userRole, setUserRole] = useState("Leader");
  const [userAvatar, setUserAvatar] = useState<string | undefined>();

  useEffect(() => {
    const currentUser = DataManager.getUser();
    if (currentUser?.name) {
      setUserName(currentUser.name);
    }
    if (currentUser?.role) {
      setUserRole(currentUser.role);
    }
    if (currentUser?.avatar) {
      setUserAvatar(currentUser.avatar);
    }
  }, []);

  const handleLogout = () => {
    DataManager.cleanAll();
    router.push("/login");
  };

  return (
    <header className="relative z-30 w-full bg-transparent border-none shadow-none px-4 sm:px-6 pt-3 pb-2 sm:py-4">
      {/* ─── MOBILE HEADER (< lg) ─── */}
      <div className={`lg:hidden flex flex-col ${showGreeting ? "gap-3.5" : "gap-0"}`}>
        {/* Top Bar: Hamburger + Samanvaya Logo+Title (left-aligned), Notification Bell + Avatar (right) */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Hamburger Menu & Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle menu"
              className="p-1.5 -ml-1 text-[#2c221e] hover:text-[#174824] transition-colors cursor-pointer flex-shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src="/image-assets/04_lotus_icon_gold.png"
                  alt="Lotus Emblem"
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif-display text-xl font-bold text-[#174824] tracking-tight truncate">
                Samanvaya
              </span>
            </div>
          </div>

          {/* Right: Notification Bell & Profile Avatar */}
          <div className="flex items-center gap-2 -mr-1 flex-shrink-0">
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                <EAvatar
                  src={userAvatar}
                  name={userName}
                  size="md"
                  variant="gold"
                  className="hover:ring-2 hover:ring-[#174824]/30 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-[#fcfaf5] border border-[#e5d9c3] shadow-lg">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-xs font-bold text-[#174824]">{userName}</p>
                  <p className="text-[11px] text-[#8c7865] font-medium">{userRole}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#e5d9c3]/60 my-1" />
                <DropdownMenuItem
                  onClick={() => router.push("/leader-profile")}
                  className="rounded-xl text-xs font-semibold text-[#174824] hover:bg-[#faf4e8] cursor-pointer gap-2"
                >
                  <UserCircle className="w-4 h-4 text-[#174824]" />
                  <span>My Profile</span>
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

        {/* Greeting Section below Top Bar on Mobile */}
        {showGreeting && (
          <div className="space-y-0.5 pt-0.5">
            <h1 className="font-serif-display text-lg font-bold text-[#174824] flex items-center gap-1.5">
              <span>Hare Krishna, {userName}</span>
              <span className="text-base">🙏</span>
            </h1>
            <p className="text-xs text-[#5a4836] font-medium tracking-wide">
              All Glories to Srila Prabhupada
            </p>
          </div>
        )}
      </div>

      {/* ─── DESKTOP HEADER (>= lg) ─── */}
      <div className="hidden lg:flex w-full items-center justify-between gap-4">
        {/* Left Side: Devotional Greeting & Tagline */}
        {showGreeting ? (
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
        ) : (
          <div className="min-w-0" />
        )}

        {/* Right Side: Notification Bell, Help Icon, Profile Avatar */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notifications Bell Dropdown */}
          <NotificationBell />

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
              <EAvatar
                src={userAvatar}
                name={userName}
                size="xl"
                variant="gold"
                className="hover:ring-2 hover:ring-[#174824]/30 transition-all"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-[#fcfaf5] border border-[#e5d9c3] shadow-lg">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-xs font-bold text-[#174824]">{userName}</p>
                <p className="text-[11px] text-[#8c7865] font-medium">{userRole}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#e5d9c3]/60 my-1" />
              <DropdownMenuItem
                onClick={() => router.push("/leader-profile")}
                className="rounded-xl text-xs font-semibold text-[#174824] hover:bg-[#faf4e8] cursor-pointer gap-2"
              >
                <UserCircle className="w-4 h-4 text-[#174824]" />
                <span>My Profile</span>
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

