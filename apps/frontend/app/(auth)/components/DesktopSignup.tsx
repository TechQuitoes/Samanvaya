"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LotusDivider from "@/components/ui/LotusDivider";
import { useSignup } from "../hooks/useSignup";

export default function DesktopSignup() {
  const {
    formData,
    updateFormData,
    fieldErrors,
    clearFieldError,
    isLoading,
    error,
    handleDirectSignup,
  } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between p-6 lg:p-10 overflow-hidden bg-[#fcf9f2]">
      {/* Decorative Top-Left Foliage Leaves */}
      <div className="absolute top-0 left-0 w-52 h-48 pointer-events-none z-0 opacity-85">
        <Image
          src="/assests/leftSideleaf.png"
          alt="Top Left Foliage"
          fill
          className="object-contain object-top-left"
        />
      </div>

      {/* Decorative Bottom-Left Lotus Pond Landscape Artwork */}
      <div className="absolute bottom-0 left-0 w-[450px] h-[200px] pointer-events-none z-0 opacity-90 overflow-hidden">
        <Image
          src="/assests/signin_001_mobile_bg.png"
          alt="Lotus Pond Decoration"
          fill
          className="object-cover object-bottom"
        />
        {/* Soft gradient blend on pond artwork */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#fcf9f2]/50 to-[#fcf9f2] z-10" />
        <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#fcf9f2] to-transparent z-10" />
      </div>

      {/* Main Centered 2-Column Content Grid */}
      <main className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-2">
        {/* =========================================================================
            LEFT COLUMN: Centered Branding, 3 Trust Pillars, Admin Notice & Tribute
           ========================================================================= */}
        <div className="col-span-6 flex flex-col items-center text-center space-y-4 px-2">
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center w-full">
            {/* Golden Lotus Logo Emblem */}
            <div className="relative w-16 h-13 mb-1 flex items-center justify-center">
              <Image
                src="/assests/04_lotus_icon_gold.svg"
                alt="Lotus Emblem"
                width={58}
                height={48}
                className="object-contain w-15 h-12 drop-shadow-sm"
                priority
              />
            </div>

            {/* Create Account Title */}
            <h1 className="font-serif-display text-[42px] lg:text-[48px] font-bold tracking-tight text-[#134625] leading-none my-1">
              Create Account
            </h1>

            {/* Tagline / Subtitle */}
            <p className="font-serif-display text-[#4A2B18] font-semibold text-base lg:text-lg tracking-wide mt-1 mb-2">
              Join LDMS and continue your seva
            </p>

            {/* Golden Lotus Divider */}
            <LotusDivider maxWidth="xs" iconSize={16} className="my-1" />
          </div>

          {/* 3 Trust Pillars Row - Pure Clean Golden Icons */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md pt-2">
            {/* Pillar 1: Secure & Trusted */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-9 h-9 flex items-center justify-center mb-1.5">
                <svg
                  className="w-7 h-7 text-[#cfa35d]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cfa35d"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#2c221e] mb-0.5">Secure & Trusted</h3>
              <p className="text-[11px] text-[#6b5a4a] leading-snug">
                Your data is protected with highest security
              </p>
            </div>

            {/* Pillar 2: Admin Verified */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-9 h-9 flex items-center justify-center mb-1.5">
                <svg
                  className="w-7 h-7 text-[#cfa35d]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cfa35d"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#2c221e] mb-0.5">Admin Verified</h3>
              <p className="text-[11px] text-[#6b5a4a] leading-snug">
                Every account is verified by our administrator
              </p>
            </div>

            {/* Pillar 3: Seva Focused */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-9 h-9 flex items-center justify-center mb-1.5">
                <svg
                  className="w-7 h-7 text-[#cfa35d]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cfa35d"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22v-9" />
                  <path d="M12 13c-2-2-4-2-6 0 0-3 3-5 6-5s6 2 6 5c-2-2-4-2-6 0z" />
                  <circle cx="12" cy="7" r="2.5" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#2c221e] mb-0.5">Seva Focused</h3>
              <p className="text-[11px] text-[#6b5a4a] leading-snug">
                Built for leaders who serve selflessly
              </p>
            </div>
          </div>

          {/* Administrator Review Callout Box */}
          <div className="w-full max-w-md pt-2">
            <div className="bg-[#e5ece0] border border-[#d2dec9]/70 rounded-[20px] p-4 flex items-center gap-3.5 shadow-sm text-left">
              {/* Authentic Upward Leaf-Shield Icon */}
              <div className="relative w-8 h-9 flex-shrink-0 flex items-center justify-center">
                <svg
                  className="w-8 h-9 text-[#174824]"
                  viewBox="0 0 28 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Shield Outline */}
                  <path
                    d="M14 2L3 6.5V14.5C3 21.5 8 27.5 14 29.5C20 27.5 25 21.5 25 14.5V6.5L14 2Z"
                    stroke="#174824"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Central Stem */}
                  <path
                    d="M14 21V10"
                    stroke="#174824"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Bottom Pair of Leaves */}
                  <path
                    d="M14 18.5C11.5 18 9.5 16 9 13.5C11 14.5 13 16 14 18.5Z"
                    fill="#174824"
                  />
                  <path
                    d="M14 18.5C16.5 18 18.5 16 19 13.5C17 14.5 15 16 14 18.5Z"
                    fill="#174824"
                  />
                  {/* Top Pair of Leaves */}
                  <path
                    d="M14 14.5C12 14 10.5 12.5 10 10.5C11.5 11.5 13 12.5 14 14.5Z"
                    fill="#174824"
                  />
                  <path
                    d="M14 14.5C16 14 17.5 12.5 18 10.5C16.5 11.5 15 12.5 14 14.5Z"
                    fill="#174824"
                  />
                  {/* Center Top Bud */}
                  <path
                    d="M14 7.5L12.5 10H15.5L14 7.5Z"
                    fill="#174824"
                  />
                </svg>
              </div>

              {/* Message Text */}
              <p className="text-xs text-[#244b2d] font-normal leading-[1.45] tracking-tight">
                Your account will be reviewed by the administrator. You will receive an
                approval notification once activated.
              </p>
            </div>
          </div>

          {/* Bottom Sacred Tribute */}
          <div className="flex flex-col items-center text-center w-full pt-3">
            {/* Golden Lotus Divider */}
            <LotusDivider maxWidth="xs" iconSize={16} className="my-1" />

            {/* Devanagari Greeting */}
            <h2 className="font-devanagari text-2xl lg:text-[26px] font-bold text-[#134625] tracking-wide mt-1 mb-0.5">
              हरे कृष्ण
            </h2>

            {/* Subtitle / All Glories */}
            <p className="text-xs font-semibold text-[#5a4836] tracking-wide">
              All Glories to Srila Prabhupada
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Signup Form Card
           ========================================================================= */}
        <div className="col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px] xl:max-w-[460px] bg-[#fffdfa]/95 backdrop-blur-md rounded-[28px] p-6 lg:p-7 border border-amber-900/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-4">
            {/* General Error Banner */}
            {error && (
              <div className="w-full bg-red-50/90 border border-red-200/80 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => handleDirectSignup(e, agreeTerms)}
              className="flex flex-col gap-3.5"
              noValidate
            >
              {/* Full Name Field */}
              <Input
                id="desktop-signup-fullName"
                type="text"
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => {
                  updateFormData({ fullName: e.target.value });
                  clearFieldError("fullName");
                }}
                error={fieldErrors.fullName}
                placeholder="Enter your full name"
                leftIcon={<User className="w-4 h-4 text-[#4a3e31]" />}
                required
              />

              {/* Email Address Field */}
              <Input
                id="desktop-signup-email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) => {
                  updateFormData({ email: e.target.value });
                  clearFieldError("email");
                }}
                error={fieldErrors.email}
                placeholder="Enter your email address"
                leftIcon={<Mail className="w-4 h-4 text-[#4a3e31]" />}
                required
              />

              {/* Mobile Number Field */}
              <Input
                id="desktop-signup-mobile"
                type="tel"
                label="Mobile Number"
                value={formData.mobile}
                onChange={(e) => {
                  updateFormData({ mobile: e.target.value });
                  clearFieldError("mobile");
                }}
                error={fieldErrors.mobile}
                placeholder="Enter your mobile number"
                leftIcon={<Phone className="w-4 h-4 text-[#4a3e31]" />}
                required
              />

              {/* Password Field */}
              <Input
                id="desktop-signup-password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                onChange={(e) => {
                  updateFormData({ password: e.target.value });
                  clearFieldError("password");
                }}
                error={fieldErrors.password}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4 text-[#4a3e31]" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-[#8c7865] hover:text-[#4a3e31] transition-colors p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              {/* Confirm Password Field */}
              <Input
                id="desktop-signup-confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  updateFormData({ confirmPassword: e.target.value });
                  clearFieldError("confirmPassword");
                }}
                error={fieldErrors.confirmPassword}
                placeholder="Confirm your password"
                leftIcon={<Lock className="w-4 h-4 text-[#4a3e31]" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="text-[#8c7865] hover:text-[#4a3e31] transition-colors p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2.5 text-xs my-0.5">
                <input
                  type="checkbox"
                  id="desktop-agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    clearFieldError("terms");
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-[#174824] text-[#174824] focus:ring-[#174824] accent-[#174824] cursor-pointer"
                />
                <label htmlFor="desktop-agree-terms" className="text-[#2c221e] leading-snug cursor-pointer select-none">
                  I agree to the{" "}
                  <span className="text-[#174824] font-semibold hover:underline">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-[#174824] font-semibold hover:underline">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {fieldErrors.terms && (
                <span className="text-xs text-red-600 -mt-2">{fieldErrors.terms}</span>
              )}

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#174824] hover:bg-[#12391c] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-1 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
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
                    <span>Create Account</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Bottom Spacer */}
      <footer className="relative z-10 w-full" />
    </div>
  );
}
