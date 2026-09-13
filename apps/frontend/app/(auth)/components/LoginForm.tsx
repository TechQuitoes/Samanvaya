"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Clock, ShieldAlert, AlertCircle, X } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton";
import EEmailInput from "@/components/common/EEmailInput";
import EPasswordInput from "@/components/common/EPasswordInput";
import EButton from "@/components/common/EButton";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const router = useRouter();
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
          {/* Email Field with EEmailInput */}
          <EEmailInput
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field with EPasswordInput */}
          <EPasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {/* Forgot Password Link (right-aligned) */}
          <div className="flex items-center justify-end text-xs my-0.5">
            <a
              href="#forgot-password"
              className="font-semibold text-[#174824] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <EButton
            type="submit"
            variant="primary"
            isLoading={isLoading}
            loadingText="Signing In..."
            showLotusIcon
            fullWidth
            className="mt-1"
          >
            Sign In
          </EButton>

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

          {/* Create New Account Button */}
          <EButton
            variant="outline"
            onClick={() => router.push("/signup")}
            leftIcon={<User className="w-4 h-4 text-[#b88636]" />}
            fullWidth
          >
            Create New Account
          </EButton>
        </form>
      </div>
    </div>
  );
}
