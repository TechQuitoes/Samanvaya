"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
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
import GoogleAuthButton from "./GoogleAuthButton";
import { useSignup } from "../hooks/useSignup";

export default function SignupForm() {
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
    <div className="relative w-full flex flex-col items-center pt-6 pb-2 z-10">
      {/* Decorative Corner Foliage - Top Left */}
      <div className="absolute top-0 left-0 w-32 h-28 pointer-events-none z-0 opacity-75">
        <Image
          src="/assests/leftSideleaf.png"
          alt="Top Left Foliage"
          fill
          className="object-contain object-top-left"
        />
      </div>

      {/* Decorative Corner Foliage - Top Right */}
      <div className="absolute top-0 right-0 w-36 h-32 pointer-events-none z-0 opacity-80">
        <Image
          src="/assests/rightSideLeaf.png"
          alt="Top Right Foliage"
          fill
          className="object-contain object-top-right"
        />
      </div>

      {/* Back Button - Positioned lower below top-left leaves matching reference */}
      <div className="absolute top-7 left-4 z-20">
        <Link href="/login">
          <button
            type="button"
            aria-label="Back to login"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#2c221e] hover:bg-black/5 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-7 h-7 text-[#2c221e]" />
          </button>
        </Link>
      </div>

      {/* Header Branding Section - Centered with proper top spacing */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full pt-1 mb-3">
        {/* Golden Lotus Logo Emblem */}
        <div className="relative w-14 h-12 mb-1.5 flex items-center justify-center">
          <Image
            src="/assests/04_lotus_icon_gold.svg"
            alt="Lotus Emblem"
            width={56}
            height={46}
            className="object-contain w-14 h-11 drop-shadow-sm"
            priority
          />
        </div>

        {/* Create Account Title */}
        <h1 className="font-serif-display text-[38px] sm:text-[42px] font-bold tracking-tight text-[#134625] leading-tight my-0.5">
          Create Account
        </h1>

        {/* Tagline / Subtitle */}
        <p className="font-serif-display text-[#4A2B18] font-semibold text-sm sm:text-base tracking-wide mt-0.5">
          Join LDMS and continue your seva
        </p>

        {/* Golden Lotus Line Divider */}
        <LotusDivider maxWidth="xs" iconSize={16} className="mt-2.5 mb-1" />
      </div>

      {/* General Error Banner */}
      {error && (
        <div className="w-full px-4 sm:px-5 mb-2">
          <div className="w-full bg-red-50/90 border border-red-200/80 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2.5 font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form Card Container matching login001_new.png */}
      <div className="w-full px-4 sm:px-5 z-10">
        <div className="bg-[#fffdfa]/95 backdrop-blur-md rounded-[28px] p-5 sm:p-6 border border-amber-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
          <form
            onSubmit={(e) => handleDirectSignup(e, agreeTerms)}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Full Name Field */}
            <Input
              id="signup-fullName"
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
              id="signup-email"
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
              id="signup-mobile"
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
              id="signup-password"
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              required
            />

            {/* Confirm Password Field */}
            <Input
              id="signup-confirmPassword"
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
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              required
            />

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-2.5 text-xs my-0.5">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  clearFieldError("terms");
                }}
                className="w-4 h-4 mt-0.5 rounded border-[#174824] text-[#174824] focus:ring-[#174824] accent-[#174824] cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-[#2c221e] leading-snug cursor-pointer select-none">
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

            {/* OR Divider */}
            <div className="flex items-center justify-center gap-3 my-0.5">
              <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
              <span className="text-xs font-semibold text-[#8c7a68] uppercase tracking-wider">
                OR
              </span>
              <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
            </div>

            {/* Continue with Google Button */}
            <GoogleAuthButton />
          </form>
        </div>
      </div>

      {/* Administrator Review Notice Callout Box */}
      <div className="w-full px-4 sm:px-5 mt-3">
        <div className="bg-[#e5ece0] border border-[#d2dec9]/70 rounded-[20px] p-4 flex items-center gap-3.5">
          {/* Authentic Leaf-Sprout Shield Icon matching design */}
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
              {/* Bottom Pair of Leaves (pointing UPWARDS) */}
              <path
                d="M14 18.5C11.5 18 9.5 16 9 13.5C11 14.5 13 16 14 18.5Z"
                fill="#174824"
              />
              <path
                d="M14 18.5C16.5 18 18.5 16 19 13.5C17 14.5 15 16 14 18.5Z"
                fill="#174824"
              />
              {/* Top Pair of Leaves (pointing UPWARDS) */}
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
          <p className="text-xs sm:text-[13px] text-[#244b2d] font-normal leading-[1.45] tracking-tight">
            Your account will be reviewed by the administrator. You will receive an
            approval notification once activated.
          </p>
        </div>
      </div>
    </div>
  );
}
