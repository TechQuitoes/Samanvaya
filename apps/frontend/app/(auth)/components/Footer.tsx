"use client";

import Image from "next/image";
import LotusDivider from "@/components/ui/LotusDivider";

export default function Footer() {
  return (
    <footer className="relative w-full flex flex-col items-center pt-4 pb-0 px-0 z-10 text-center overflow-hidden">
      {/* Golden Lotus Divider Line */}
      <LotusDivider maxWidth="xs" iconSize={16} className="mb-1.5" />

      {/* Devanagari Heading */}
      <h2 className="font-devanagari text-2xl sm:text-[28px] font-bold text-[#174824] tracking-wide leading-tight my-0.5">
        हरे कृष्ण
      </h2>

      {/* Subtitle Text */}
      <p className="text-xs font-semibold text-[#5a4836] tracking-wide mb-1">
        All Glories to Srila Prabhupada
      </p>

      {/* Bottom Scenic Lotus Pond & Temple Artwork Banner */}
      <div className="relative w-full h-[160px] sm:h-[180px] overflow-hidden mt-1" style={{ position: "relative" }}>
        <Image
          src="/assests/signin_001_mobile_bg.png"
          alt="Lotus Pond Landscape Footer"
          fill
          priority
          className="object-cover object-bottom"
        />
        {/* Top Smooth Blend from parchment bg into lotus pond */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#f5efe1] via-[#f5efe1]/80 to-transparent z-10" />
      </div>
    </footer>
  );
}
