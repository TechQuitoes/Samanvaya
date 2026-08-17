"use client";

import Image from "next/image";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LotusDivider from "@/components/ui/LotusDivider";

export default function Header() {
  return (
    <header className="relative w-full flex flex-col items-center pt-0 pb-1 overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        {/* Menu Button */}
        <Button variant="icon" aria-label="Open menu">
          <Menu className="w-5 h-5 text-[#2c221e]" />
        </Button>

        {/* Language Selector Pill */}
        <button
          type="button"
          aria-label="Select language"
          className="px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-amber-900/10 flex items-center gap-1.5 text-xs font-semibold text-[#2c221e] hover:bg-white transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#2c221e]" />
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#2c221e]" />
        </button>
      </div>

      {/* Hero Illustration Image Banner */}
      <div
        className="relative w-full h-[280px] sm:h-[320px] overflow-hidden"
        style={{ position: "relative" }}
      >
        <Image
          src="/assests/bg1.png"
          alt="Divine Radha & Temple Banner"
          fill
          priority
          className="object-cover object-top"
        />
        {/* Top Soft Vignette for buttons visibility */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent z-10" />
        {/* Soft Bottom Blend Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f5efe1] via-[#f5efe1]/70 to-transparent" />
      </div>

      {/* Brand Title & Sacred Greetings Header */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 -mt-6">
        {/* Sacred Greeting */}
        <h1 className="text-xl sm:text-2xl font-semibold text-[#174824] flex items-center gap-1.5 font-sans">
          <span>Hare Krishna!</span>
          <span className="text-lg">🙏</span>
        </h1>

        {/* Lotus Divider Top */}
        <LotusDivider maxWidth="md" iconSize={24} className="my-2" />

        {/* LDMS Main Logo Text */}
        <h2 className="font-serif-display text-5xl sm:text-6xl font-bold tracking-tight text-[#174824] leading-none my-1">
          LDMS
        </h2>

        {/* Subtitle */}
        <p className="font-serif-display text-amber-950 font-bold text-base sm:text-lg max-w-[260px] sm:max-w-[300px] leading-tight mt-1 opacity-90">
          Leader Documentation & Management System
        </p>

        {/* Tagline */}
        <p className="text-[#216833] font-semibold text-xs sm:text-sm tracking-wide mt-2">
          Serving Leaders. Strengthening Seva.
        </p>

        {/* Small Golden Lotus Icon Below Tagline */}
        <div className="relative w-4 h-4 mt-2">
          <Image
            src="/assests/flower-icon.png"
            alt="Lotus Accent"
            width={20}
            height={20}
            className="object-contain opacity-80"
          />
        </div>
      </div>
    </header>
  );
}
