"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import LotusDivider from "@/components/ui/LotusDivider";

export default function Header() {
  return (
    <header className="relative w-full flex flex-col items-center overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-30 flex items-center">
        {/* Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-amber-950/15 flex items-center justify-center text-[#2c221e] hover:bg-white transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5 text-[#2c221e]" />
        </button>
      </div>

      {/* Radha Rani Top Image Container with Smooth Bottom Fade */}
      <div className="relative w-full h-[370px] overflow-hidden" style={{ position: "relative" }}>
        <Image
          src="/assests/signin_001_mobile_bg.png"
          alt="Divine Radha & Temple Background"
          fill
          priority
          className="object-cover object-top"
        />
        {/* Top Vignette for button contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent z-10" />
        {/* Bottom Smooth Blend into parchment bg */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f5efe1] via-[#f5efe1]/70 to-transparent z-10" />
      </div>

      {/* Brand Branding Section - Positioned right at the bottom of the fade transition */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full -mt-10 pb-1">
        {/* Prominent Golden Lotus Logo Emblem */}
        <div className="relative w-[86px] h-12 mb-1.5 flex items-center justify-center">
          <Image
            src="/assests/04_lotus_icon_gold.svg"
            alt="Lotus Emblem"
            width={56}
            height={46}
            className="object-contain w-14 h-11 drop-shadow-sm"
            priority
          />
        </div>

        {/* Samanvaya Brand Title */}
        <h1 className="font-serif-display text-[48px] font-semibold tracking-[0.01em] text-[#134625] leading-none my-1">
          Samanvaya
        </h1>

        {/* Tagline */}
        <p className="font-serif-display text-[#4A2B18] font-semibold text-sm sm:text-[15px] tracking-wide mt-1">
          Organise • Coordinate • Serve
        </p>

        {/* Golden Lotus Line Divider */}
        <LotusDivider maxWidth="xs" iconSize={36} className="mt-3 mb-1" />
      </div>
    </header>
  );
}
