"use client";

import Image from "next/image";
import LotusDivider from "@/components/ui/LotusDivider";

export default function Footer() {
  return (
    <footer className="relative w-full flex flex-col items-center pt-2 pb-0 mt-2 overflow-hidden">
      {/* Top Lotus Divider Line */}
      <LotusDivider maxWidth="sm" iconSize={24} className="mb-3" />

      {/* Devanagari Heading with Golden Flanked Lines */}
      <LotusDivider maxWidth="sm" text="हरे कृष्ण" isDevanagari className="my-1" />

      {/* Subtitle Text */}
      <p className="text-xs font-semibold text-[#5a4836] tracking-wide mt-0.5">
        All Glories to Srila Prabhupada
      </p>

      {/* Bottom Lotus Accent */}
      <div className="relative w-4 h-4 mt-2 mb-4">
        <Image
          src="/assests/flower-icon.png"
          alt="Lotus Accent"
          width={16}
          height={16}
          className="object-contain opacity-80"
        />
      </div>

      {/* Bottom Scenic Lotus Artwork Banner */}
      <div
        className="relative w-full h-44 sm:h-52 overflow-hidden mt-1"
        style={{ position: "relative" }}
      >
        <Image
          src="/assests/templeWithBorder.png"
          alt="Sacred Temple & Lotus Landscape"
          fill
          className="object-cover object-bottom"
        />
        {/* Soft Fade Overlay blending top into background */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f5efe1] via-[#f5efe1]/60 to-transparent" />
      </div>
    </footer>
  );
}
