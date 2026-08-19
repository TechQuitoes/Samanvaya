"use client";

import Image from "next/image";
import { X } from "lucide-react";
import LotusDivider from "@/components/ui/LotusDivider";
import SidebarMenuItems from "./SidebarMenuItems";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Sidebar Component: Fixed Drawer on Mobile (< lg), Sticky Pinned Sidebar on Desktop (>= lg) */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 lg:z-30 w-72 h-screen text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out flex-shrink-0 overflow-hidden ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Background Image */}
        <Image
          src="/images/sidebar/left_navigation_web_bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-bottom z-0"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15 z-[1]" />

        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full justify-between p-6">
          <div className="space-y-6">
            {/* Top Logo & Title (Center Aligned as requested) */}
            <div className="relative flex flex-col items-center text-center pt-2">
              {/* Close button visible ONLY on mobile drawer */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden absolute top-0 right-0 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-12 h-12 mb-2 flex-shrink-0">
                <Image
                  src="/assets/04_lotus_icon_gold.png"
                  alt="Lotus Emblem"
                  width={48}
                  height={48}
                  className="object-contain filter drop-shadow-md"
                />
              </div>

              <h2 className="font-serif-display text-2xl font-bold text-white tracking-wide drop-shadow-sm">
                Samanvaya
              </h2>
              <p className="text-[11px] text-emerald-100/80 font-medium tracking-wider mt-0.5">
                Organise &bull; Coordinate &bull; Serve
              </p>
            </div>

            <LotusDivider maxWidth="full" iconSize={14} className="opacity-40" />

            {/* Reusable Nav Items with Gold Active State & Icon Rendering */}
            <div className="flex-1 overflow-y-auto pr-1 -mr-1 max-h-[calc(100vh-260px)] space-y-1">
              <SidebarMenuItems onItemClick={onClose} />
            </div>
          </div>

          {/* Bottom space intentionally clean to show the sacred background lotus art */}
          <div className="h-10 flex-shrink-0" />
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
