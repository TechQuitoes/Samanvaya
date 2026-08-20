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
    <div className="relative h-screen w-full bg-[#f7f3e9] flex flex-col lg:flex-row overflow-hidden">
      {/* Background Sacred Temple Banner Illustration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/dashboard/admin_dashboard_bg_001.png"
          alt="Sacred Dashboard Background"
          fill
          priority
          className="object-cover object-top opacity-40 lg:opacity-50 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f3e9]/40 via-[#f7f3e9]/70 to-[#f7f3e9] z-0" />
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

      {/* Main Workspace Area — ONLY this area scrolls */}
      <div className="relative z-20 flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          pendingCount={pendingUsers.length}
        />

        {/* Main Page Content */}
        <main className="flex-1 w-full px-6 py-4 pb-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
