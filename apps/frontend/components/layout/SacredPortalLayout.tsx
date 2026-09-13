"use client";

import { useState } from "react";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import SacredPageHeader from "@/components/common/SacredPageHeader";

export interface SacredHeroArtworkProps {
  imageSrc?: string;
  alt?: string;
  quote?: string;
  author?: string;
}

export interface SacredPortalLayoutProps {
  children: React.ReactNode;
  showGreeting?: boolean;

  // Integrated Sacred Page Header
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  headerClassName?: string;

  // Optional Mobile Hero Artwork Banner
  heroArtwork?: boolean | SacredHeroArtworkProps;

  // Optional Sacred Footer Artwork Banner
  showFooterBanner?: boolean;

  // Optional Container wrapper styling
  containerClassName?: string;
}

export default function SacredPortalLayout({
  children,
  showGreeting = true,
  title,
  subtitle,
  icon,
  actions,
  headerClassName,
  heroArtwork,
  showFooterBanner = false,
  containerClassName,
}: SacredPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const heroData = typeof heroArtwork === "object"
    ? {
        imageSrc: heroArtwork.imageSrc || "/image-assets/header_img01.png",
        alt: heroArtwork.alt || "Radha Rani and Vedic Temple Artwork",
        quote: heroArtwork.quote || "Travel to serve, Serve to inspire, Inspire to glorify.",
        author: heroArtwork.author || "Srila Prabhupada",
      }
    : {
        imageSrc: "/image-assets/header_img01.png",
        alt: "Radha Rani and Vedic Temple Artwork",
        quote: "Travel to serve, Serve to inspire, Inspire to glorify.",
        author: "Srila Prabhupada",
      };

  const hasHeaderOrArtwork = !!(title || heroArtwork || showFooterBanner);

  const content = (
    <>
      {/* Mobile Hero Artwork Banner */}
      {heroArtwork && (
        <div className="relative -mx-6 -mt-[76px] pb-2 overflow-hidden w-[calc(100%+3rem)] md:hidden">
          <div className="relative h-[380px] sm:h-[420px] w-full [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
            <Image
              src={heroData.imageSrc}
              alt={heroData.alt}
              fill
              priority
              className="object-cover object-[center_16%]"
            />
            {/* Gentle soft blur only at the very top under header bar */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#f7f3e9]/50 to-transparent backdrop-blur-[1.5px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)] pointer-events-none" />
            {/* Subtle bottom fade into page background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-65% to-[#f7f3e9]" />
          </div>

          <div className="absolute bottom-2 left-4 z-10 w-[64%] max-w-[270px]">
            <div className="bg-[#fffdfa]/95 backdrop-blur-md border border-[#e5d9c3] rounded-2xl p-2.5 pt-3.5 text-center shadow-md relative">
              {/* Sacred Lotus Icon at Top */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5">
                <Image
                  src="/image-assets/04_lotus_icon_gold.png"
                  alt="Lotus"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-serif-display text-[11px] sm:text-xs italic font-bold text-[#174824] leading-tight">
                &ldquo;{heroData.quote}&rdquo;
              </p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-[#8c7865] mt-1">
                &mdash; {heroData.author}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Integrated Sacred Page Header */}
      {title && icon && (
        <SacredPageHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          actions={actions}
          className={headerClassName}
        />
      )}

      {/* Page Body Content */}
      {children}

      {/* Optional Sacred Footer Artwork Banner */}
      {showFooterBanner && (
        <footer className="relative mt-8 rounded-2xl sm:rounded-[28px] overflow-hidden border border-[#e5d9c3] shadow-sm">
          <div className="relative w-full aspect-[2172/469]">
            <Image
              src="/image-assets/footer_img01.png"
              alt="Sacred Samanvaya Footer Banner"
              fill
              priority={false}
              className="object-cover"
            />
          </div>
        </footer>
      )}
    </>
  );

  return (
    <div className="relative h-screen w-full bg-[#f7f3e9] flex flex-col lg:flex-row overflow-hidden">
      {/* Background Sacred Temple Banner Illustration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/image-assets/admin_dashboard_bg_001.png"
          alt="Sacred Dashboard Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-40 lg:opacity-50 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f3e9]/40 via-[#f7f3e9]/70 to-[#f7f3e9] z-0" />
      </div>

      {/* Cascading Corner Leaf Graphics */}
      <div className="fixed top-0 left-0 w-28 sm:w-56 h-28 sm:h-56 pointer-events-none z-10 opacity-75 sm:opacity-90">
        <Image
          src="/image-assets/leftSideleaf.png"
          alt="Top Left Cascading Leaves"
          fill
          priority
          sizes="(max-width: 640px) 112px, 224px"
          className="object-contain object-top-left"
        />
      </div>
      <div className="fixed top-0 right-0 w-28 sm:w-56 h-28 sm:h-56 pointer-events-none z-10 opacity-75 sm:opacity-90">
        <Image
          src="/image-assets/rightSideLeaf.png"
          alt="Top Right Cascading Leaves"
          fill
          priority
          sizes="(max-width: 640px) 112px, 224px"
          className="object-contain object-top-right"
        />
      </div>

      {/* Dark Green Sacred Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Area — ONLY this area scrolls */}
      <div className="relative z-20 flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          showGreeting={showGreeting}
        />

        {/* Main Page Content */}
        <main className="flex-1 w-full px-6 py-4 pb-8 space-y-6">
          {hasHeaderOrArtwork ? (
            <div className={containerClassName || "space-y-6 max-w-6xl mx-auto pb-8"}>
              {content}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
