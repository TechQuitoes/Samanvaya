"use client";

import Image from "next/image";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginForm from "./LoginForm";

export default function DesktopLogin() {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between p-6 lg:p-10 overflow-hidden bg-[#f7f3e9]">
      {/* Background Desktop Illustration Banner */}
      <div className="absolute inset-0 z-0 overflow-hidden" style={{ position: "absolute" }}>
        <Image
          src="/assests/templeDesktop.png"
          alt="Sacred Temple Landscape Desktop"
          fill
          priority
          className="object-cover transition-all"
        />
        {/* Soft Ambient Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3e9]/60 via-[#f7f3e9]/20 to-[#f7f3e9]/5 z-0" />
      </div>

      {/* Top Floating Control Bar */}
      <header className="relative z-20 w-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Menu Button */}
        <Button
          variant="icon"
          aria-label="Open menu"
          className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur-md shadow-sm border border-amber-900/10 flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-[#2c221e]" />
        </Button>

        {/* Right Language Selector Pill */}
        <button
          type="button"
          aria-label="Select language"
          className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-amber-900/10 flex items-center gap-2 text-xs font-semibold text-[#2c221e] hover:bg-white transition-all cursor-pointer"
        >
          <Globe className="w-4 h-4 text-[#2c221e]" />
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#2c221e]" />
        </button>
      </header>

      {/* Main Content Grid: Left Branding + Right Login Form Card */}
      <main className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Column: Branding & Sacred Greeting */}
        <div className="relative lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 px-2 py-4">
          {/* Seamless Borderless Smoky Radial Mist Layer */}
          <div
            className="absolute -inset-10 pointer-events-none z-0 blur-2xl opacity-90"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(253, 249, 238, 0.88) 0%, rgba(253, 249, 238, 0.5) 45%, transparent 75%)",
            }}
          />

          <div className="relative z-10 space-y-4 max-w-xl">
            {/* Sacred Greeting */}
            <h1 className="text-4xl lg:text-5xl font-bold text-[#174824] flex items-center justify-center lg:justify-start gap-3">
              <span>Hare Krishna!</span>
              <span className="text-3xl lg:text-4xl">🙏</span>
            </h1>

            {/* Title & Subtitle */}
            <h2 className="font-serif-display text-2xl lg:text-3xl font-bold text-[#4a3e31] leading-snug">
              Leader Documentation & Management System
            </h2>

            {/* Lotus Divider Accent */}
            <div className="flex items-center gap-3 my-2 w-full max-w-xs mx-auto lg:mx-0">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#cfa35d] via-[#cfa35d] to-transparent" />
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src="/assests/flower-icon.png"
                  alt="Lotus Icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-[#cfa35d] via-[#cfa35d] to-transparent" />
            </div>

            {/* Subtitle / All Glories */}
            <p className="text-base lg:text-lg font-semibold text-[#5a4836] tracking-wide">
              All Glories to Srila Prabhupada
            </p>
          </div>
        </div>

        {/* Right Column: Reusable Login Form Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px]">
            <LoginForm showCardFooter />
          </div>
        </div>
      </main>

      <div className="relative z-10 w-full" />
    </div>
  );
}
