"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Loader2, Clock, ShieldAlert, AlertCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm({ showCardFooter = false }: { showCardFooter?: boolean }) {
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
    <div className="w-full px-4 py-2 z-10">
      <Card className="relative flex flex-col gap-4 p-5 sm:p-6 overflow-hidden">
        {/* Decorative Top Leaf Graphics */}
        <div className="absolute top-0 left-0 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none z-0">
          <Image
            src="/assests/leftSideleaf.png"
            alt="Top Left Leaf Accent"
            fill
            className="object-contain object-top-left opacity-90"
          />
        </div>
        <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none z-0">
          <Image
            src="/assests/rightSideLeaf.png"
            alt="Top Right Leaf Accent"
            fill
            className="object-contain object-top-right opacity-90"
          />
        </div>

        {/* Top Header Lotus Emblem */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-2 pt-1">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src="/assests/flower-icon.png"
              alt="Lotus Emblem"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#174824] tracking-wide">
              Sign In
            </h1>
            <p className="text-[#5a4836] font-medium text-xs sm:text-sm">
              Welcome back! Please enter your details
            </p>
          </div>
        </div>

        {/* Continue with Google Button */}
        <div className="relative z-10 flex flex-col gap-4">
          <GoogleButton onClick={() => console.log("Google Login clicked")} />

          {/* OR Divider */}
          <div className="flex items-center justify-center gap-3 my-0.5">
            <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
            <span className="text-xs font-semibold text-[#8c7a68] uppercase tracking-wider">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
          </div>

          {/* Status Banners & Error Messages */}
          {isPendingApproval ? (
            <div className="w-full bg-gradient-to-b from-[#fffaf0] via-[#fcf6e8] to-[#faf3e0] border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(217,119,6,0.08)] relative overflow-hidden animate-in fade-in duration-300">
              {/* Ambient Golden Glow Accent */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-800 flex-shrink-0 mt-0.5 shadow-sm">
                  <Clock className="w-5 h-5 animate-pulse text-amber-700" />
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-amber-950 text-sm sm:text-base tracking-tight">
                        Account Pending Approval
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 border border-amber-300/70 text-amber-900 font-semibold uppercase tracking-wider">
                        Pending
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-amber-800/60 hover:text-amber-950 p-1 transition-colors"
                      aria-label="Dismiss warning"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                    {error ||
                      "Your account registration has been submitted and is currently awaiting Administrator verification. You will be able to sign in once approved."}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-amber-800/80 font-semibold border-t border-amber-200/60 mt-2">
                    <span className="flex items-center gap-1.5">
                      <div className="relative w-3.5 h-3.5 flex-shrink-0">
                        <Image
                          src="/assests/flower-icon.png"
                          alt="Lotus"
                          width={14}
                          height={14}
                          className="object-contain opacity-80"
                        />
                      </div>
                      <span>Contact your Administrator for approval</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : isRejected ? (
            <div className="w-full bg-red-50/90 border border-red-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-xs text-red-800 font-medium animate-in fade-in">
              <div className="p-2 rounded-xl bg-red-100 text-red-700 flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-red-900 text-sm">Account Request Rejected</h3>
                <p className="text-xs text-red-700 leading-relaxed">{error}</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full bg-red-50/90 border border-red-200/80 text-red-700 text-xs rounded-xl p-3.5 flex items-center gap-2.5 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <Input
              id="login-email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            {/* Password Field */}
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#8c7865] hover:text-[#4a3e31] transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
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
                  className="w-4 h-4 rounded border-[#cfa35d] text-[#174824] focus:ring-[#174824] accent-[#174824] cursor-pointer"
                />
                <span className="font-semibold text-[#4a3e31]">Remember me</span>
              </label>
              <a
                href="#forgot-password"
                className="font-bold text-[#174824] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="sacred-primary"
              disabled={isLoading}
              className="w-full mt-1 flex items-center justify-center gap-2"
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
                      src="/assests/flower-icon.png"
                      alt="Lotus"
                      width={20}
                      height={20}
                      className="object-contain brightness-200 contrast-125"
                    />
                  </div>
                  <span>Sign In</span>
                </>
              )}
            </Button>

            {/* Create New Account Button */}
            <Link href="/signup" className="w-full">
              <Button type="button" variant="sacred-outline" className="w-full">
                <User className="w-5 h-5 text-[#b88636]" />
                <span>Create New Account</span>
              </Button>
            </Link>
          </form>

          {/* Optional Card Footer Tribute for Desktop Card view */}
          {showCardFooter && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#e8dfcf]/60 text-xs font-semibold text-[#5a4836]">
              <div className="relative w-4 h-4 flex-shrink-0">
                <Image
                  src="/assests/flower-icon.png"
                  alt="Lotus Icon"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span>All Glories to Srila Prabhupada</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
