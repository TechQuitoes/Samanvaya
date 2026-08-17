"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  UserCheck,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Plane,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LotusDivider from "@/components/ui/LotusDivider";
import DataManager from "@/lib/data-manager";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    DataManager.cleanAll();
    router.push("/login");
  };

  return (
    <>
      {/* Sidebar Component: Fixed Drawer on Mobile (< lg), Sticky Pinned Sidebar on Desktop (>= lg) */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 lg:z-30 w-72 h-screen bg-[#174824] text-white flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-in-out flex-shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Top Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/assests/flower-icon.png"
                  alt="Lotus Emblem"
                  width={40}
                  height={40}
                  className="object-contain brightness-200 contrast-125"
                />
              </div>
              <div>
                <h2 className="font-serif-display text-2xl font-bold text-amber-200 tracking-wider">
                  LDMS
                </h2>
                <p className="text-[10px] text-emerald-200 font-medium tracking-wide">
                  Leader Portal
                </p>
              </div>
            </div>
            {/* Close button visible ONLY on mobile drawer */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <LotusDivider maxWidth="full" iconSize={16} className="opacity-60" />

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-emerald-100 font-medium text-sm transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5 text-emerald-300" />
              <span>Portal Main</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/leader-profile")}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-emerald-100 font-medium text-sm transition-all cursor-pointer"
            >
              <UserCircle className="w-5 h-5 text-amber-300" />
              <span>Leader Profile</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/travel")}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-emerald-100 font-medium text-sm transition-all cursor-pointer"
            >
              <Plane className="w-5 h-5 text-emerald-300" />
              <span>Travel Management</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/approvals")}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-emerald-100 font-medium text-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-emerald-300" />
              <span>Account Approvals</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-emerald-100 font-medium text-sm transition-all cursor-pointer opacity-70"
            >
              <Settings className="w-5 h-5 text-emerald-300" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Tribute */}
        <div className="space-y-4 pt-4 border-t border-emerald-800/80 text-center">
          <div className="flex justify-center">
            <div className="relative w-8 h-8 opacity-80">
              <Image
                src="/assests/flower-icon.png"
                alt="Lotus"
                width={32}
                height={32}
                className="object-contain brightness-200"
              />
            </div>
          </div>
          <p className="font-serif-display text-xs text-amber-200/90 font-medium tracking-wide">
            All Glories to Srila Prabhupada
          </p>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 rounded-xl py-2.5 text-xs font-semibold gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Account
          </Button>
        </div>
      </aside>

      {/* Backdrop overlay visible ONLY on mobile drawer when open */}
      {open && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        />
      )}
    </>
  );
}
