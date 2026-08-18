"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  ChevronDown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  Clock,
  ShieldAlert,
  AlertCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import LotusDivider from "@/components/ui/LotusDivider";
import { useLogin } from "../hooks/useLogin";

export default function DesktopLogin() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    setError,
    isPendingApproval,
    isRejected,
    handleSubmit,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-row overflow-hidden bg-[#fcf9f2]">
      {/* =========================================================================
          LEFT PANEL (50%): Radha Rani & Temple Artwork with Radiant Mist Glow
         ========================================================================= */}
      <div className="relative w-1/2 min-h-screen overflow-hidden flex flex-col justify-end border-r border-[#e8dfcf]/60">
        {/* Full Edge-to-Edge Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assests/signin_001_mobile_bg.png"
            alt="Divine Radha & Sacred Temple Landscape"
            fill
            priority
            className="object-cover object-[24%_top]"
          />
        </div>

        {/* Soft Radiant Morning Mist Behind Branding Text */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 95% 65% at 28% 78%, rgba(253, 249, 240, 0.96) 0%, rgba(253, 249, 240, 0.88) 32%, rgba(253, 249, 240, 0.45) 58%, transparent 75%)",
          }}
        />

        {/* Soft bottom edge transition */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fcf9f2] via-[#fcf9f2]/75 to-transparent z-10" />

        {/* Branding Block - Positioned over radiant mist glow */}
        <div className="relative z-20 flex flex-col items-center text-center w-[340px] lg:w-[380px] ml-6 lg:ml-12 xl:ml-16 mb-10 lg:mb-14">
          {/* Samanvaya Title */}
          <h1 className="font-serif-display text-[44px] lg:text-[50px] font-bold tracking-tight text-[#134625] leading-none my-1 drop-shadow-sm">
            Samanvaya
          </h1>

          {/* Tagline */}
          <p className="font-serif-display text-[#4A2B18] font-semibold text-sm lg:text-base tracking-wide mt-1 mb-2">
            Organise • Coordinate • Serve
          </p>

          {/* Golden Lotus Divider Line */}
          <LotusDivider maxWidth="xs" iconSize={16} className="my-1" />

          {/* Devanagari Greeting */}
          <h2 className="font-devanagari text-2xl lg:text-[28px] font-bold text-[#134625] tracking-wide mt-1.5 mb-0.5">
            हरे कृष्ण
          </h2>

          {/* Subtitle / All Glories */}
          <p className="text-xs lg:text-sm font-semibold text-[#5a4836] tracking-wide">
            All Glories to Srila Prabhupada
          </p>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL (50%): Welcome Back Login Form with Sharp Background
         ========================================================================= */}
      <div className="relative w-1/2 min-h-screen flex flex-col justify-between p-8 lg:p-12 xl:p-14 bg-[#fcf9f2]">
        {/* Top Right Control Bar */}
        <div className="w-full flex justify-end items-center z-20">
          <button
            type="button"
            aria-label="Select language"
            className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-amber-950/15 flex items-center gap-1.5 text-xs font-semibold text-[#2c221e] hover:bg-white transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#2c221e]" />
            <span>EN</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#2c221e]" />
          </button>
        </div>

        {/* Center Login Form Container */}
        <div className="w-full max-w-[400px] mx-auto z-10 my-auto py-4">
          {/* Header Heading & Subtitle */}
          <div className="text-center mb-6">
            <h2 className="font-serif-display text-[32px] lg:text-[36px] font-bold text-[#134625] tracking-tight leading-tight">
              Welcome Back
            </h2>
            <p className="font-serif-display text-[#4A2B18] font-medium text-sm lg:text-base mt-1">
              Sign in to continue your seva
            </p>
          </div>

          {/* Status / Error Alerts */}
          {isPendingApproval ? (
            <div className="w-full bg-[#fffaf0] border-2 border-amber-400/80 rounded-2xl p-4 shadow-sm mb-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 animate-pulse text-amber-700 mt-0.5 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-950 text-xs">Account Pending Approval</h3>
                    <button type="button" onClick={() => setError(null)} className="text-amber-800/60 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {error || "Your account registration has been submitted and is currently awaiting Administrator verification."}
                  </p>
                </div>
              </div>
            </div>
          ) : isRejected ? (
            <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-xs text-red-800 font-medium mb-4">
              <ShieldAlert className="w-5 h-5 text-red-700 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-bold text-red-900 text-sm">Account Request Rejected</h3>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2.5 font-medium mb-4">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <Input
              id="desktop-email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              leftIcon={<Mail className="w-4 h-4 text-[#4a3e31]" />}
              required
            />

            {/* Password Field */}
            <Input
              id="desktop-password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Lock className="w-4 h-4 text-[#4a3e31]" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#8c7865] hover:text-[#4a3e31] transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#4a3e31]" /> : <Eye className="w-4 h-4 text-[#4a3e31]" />}
                </button>
              }
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs my-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#174824] text-[#174824] focus:ring-[#174824] accent-[#174824] cursor-pointer"
                />
                <span className="font-semibold text-[#2c221e]">Remember Me</span>
              </label>
              <a href="#forgot-password" className="font-semibold text-[#174824] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#174824] hover:bg-[#12391c] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-1 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <Image
                      src="/assests/04_lotus_icon_gold.svg"
                      alt="Lotus"
                      width={20}
                      height={20}
                      className="object-contain brightness-200"
                    />
                  </div>
                  <span>Sign In</span>
                </>
              )}
            </Button>

            {/* OR Divider */}
            <div className="flex items-center justify-center gap-3 my-1">
              <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
              <span className="text-xs font-semibold text-[#8c7a68] uppercase tracking-wider">
                OR
              </span>
              <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
            </div>

            {/* Continue with Google */}
            <GoogleButton onClick={() => console.log("Google Login clicked")} />

            {/* Create New Account Button */}
            <Link href="/signup" className="w-full">
              <Button
                type="button"
                className="w-full h-12 bg-white hover:bg-amber-50/40 border border-[#cfa35d] text-[#b88636] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-[#b88636]" />
                <span>Create New Account</span>
              </Button>
            </Link>
          </form>
        </div>

        {/* Bottom Spacer */}
        <div className="w-full" />
      </div>
    </div>
  );
}
