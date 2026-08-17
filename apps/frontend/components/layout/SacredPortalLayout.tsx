"use client";

import { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/app/(admin)/components/AdminSidebar";
import AdminHeader from "@/app/(admin)/components/AdminHeader";
import useAdminApprovals from "@/app/(admin)/hooks/useAdminApprovals";

interface SacredPortalLayoutProps {
  children: React.ReactNode;
}

export default function SacredPortalLayout({ children }: SacredPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pendingUsers } = useAdminApprovals();

  return (
    <div className="relative min-h-screen w-full bg-[#f7f3e9] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background Sacred Temple Banner Illustration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/assests/templeDesktop.png"
          alt="Sacred Temple Landscape"
          fill
          priority
          className="object-cover object-top opacity-30 lg:opacity-40 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f3e9]/50 via-[#f7f3e9]/80 to-[#f7f3e9] z-0" />
      </div>

      {/* Cascading Corner Leaf Graphics */}
      <div className="fixed top-0 left-0 w-28 sm:w-56 h-28 sm:h-56 pointer-events-none z-10 opacity-75 sm:opacity-90">
        <Image
          src="/assests/leftSideleaf.png"
          alt="Top Left Cascading Leaves"
          fill
          className="object-contain object-top-left"
        />
      </div>
      <div className="fixed top-0 right-0 w-28 sm:w-56 h-28 sm:h-56 pointer-events-none z-10 opacity-75 sm:opacity-90">
        <Image
          src="/assests/rightSideLeaf.png"
          alt="Top Right Cascading Leaves"
          fill
          className="object-contain object-top-right"
        />
      </div>

      {/* Dark Green Sacred Sidebar (Pinned on Desktop, Slide-over Drawer on Mobile) */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Area (Right of Sidebar on Desktop) */}
      <div className="relative z-20 flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          pendingCount={pendingUsers.length}
        />

        {/* Main Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
          {children}
        </main>

        {/* Page Bottom Sacred Footer */}
        <footer className="relative z-20 w-full py-6 border-t border-[#e5d9c3]/60 bg-[#faf4e8]/60 text-center space-y-2">
          <div className="flex justify-center items-center gap-2 text-xs font-bold text-[#5a4836]">
            <div className="relative w-4 h-4 flex-shrink-0">
              <Image
                src="/assests/flower-icon.png"
                alt="Lotus Icon"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span>All Glories to Srila Prabhupada</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
