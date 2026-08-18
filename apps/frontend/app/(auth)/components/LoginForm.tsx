"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Loader2, Clock, ShieldAlert, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
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
    <div className="w-full px-4 sm:px-5 py-2 z-20">
      {/* Form Card Container matching login001_new.png */}
      <div className="bg-[#fffdfa]/95 backdrop-blur-md rounded-[28px] p-5 sm:p-6 border border-amber-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
        {/* Status Banners & Error Messages */}
        {isPendingApproval ? (
          <div className="w-full bg-gradient-to-b from-[#fffaf0] via-[#fcf6e8] to-[#faf3e0] border-2 border-amber-400/80 rounded-2xl p-4 shadow-sm relative overflow-hidden animate-in fade-in duration-300">
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-800 flex-shrink-0 mt-0.5 shadow-sm">
                <Clock className="w-5 h-5 animate-pulse text-amber-700" />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-amber-950 text-xs sm:text-sm tracking-tight">
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
                    "Your account registration has been submitted and is currently awaiting Administrator verification."}
                </p>
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
          <div className="w-full bg-red-50/90 border border-red-200/80 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2.5 font-medium animate-in fade-in">
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
            leftIcon={<Mail className="w-4 h-4 text-[#4a3e31]" />}
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
            leftIcon={<Lock className="w-4 h-4 text-[#4a3e31]" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-[#8c7865] hover:text-[#4a3e31] transition-colors p-0.5"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#4a3e31]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#4a3e31]" />
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
                className="w-4 h-4 rounded border-[#174824] text-[#174824] focus:ring-[#174824] accent-[#174824] cursor-pointer"
              />
              <span className="font-semibold text-[#2c221e]">Remember Me</span>
            </label>
            <a
              href="#forgot-password"
              className="font-semibold text-[#174824] hover:underline"
            >
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
          <div className="flex items-center justify-center gap-3 my-0.5">
            <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
            <span className="text-xs font-semibold text-[#8c7a68] uppercase tracking-wider">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-[#e4d9c6]" />
          </div>

          {/* Continue with Google Button */}
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
    </div>
  );
}
