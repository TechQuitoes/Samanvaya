"use client";

import React from "react";
import { Loader2, Clock, ShieldAlert, X } from "lucide-react";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

/**
 * GoogleAuthButton — Reusable "Continue with Google" component.
 * Handles Google SDK initialization, credential flow, and status banners.
 *
 * Drop this into any auth page (Login / Signup) — it manages its own state.
 */
export default function GoogleAuthButton() {
  const {
    triggerGoogleAuth,
    hiddenButtonRef,
    isLoading,
    error,
    isPendingApproval,
    isRejected,
    resetState,
  } = useGoogleAuth();

  return (
    <div className="w-full space-y-3 relative">
      {/* Hidden container for native GSI popup trigger */}
      <div
        ref={hiddenButtonRef}
        className="absolute top-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Pending Approval Banner */}
      {isPendingApproval && (
        <div className="w-full bg-gradient-to-b from-[#fffaf0] via-[#fcf6e8] to-[#faf3e0] border-2 border-amber-400/80 rounded-2xl p-3.5 shadow-sm relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-1.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-800 flex-shrink-0 mt-0.5 shadow-sm">
              <Clock className="w-4 h-4 animate-pulse text-amber-700" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-amber-950 text-xs tracking-tight">
                  Account Pending Approval
                </h3>
                <button
                  type="button"
                  onClick={resetState}
                  className="text-amber-800/60 hover:text-amber-950 p-1 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Your Google account has been registered. Please wait for an administrator to approve your access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Banner */}
      {isRejected && (
        <div className="w-full bg-gradient-to-b from-[#fff5f5] to-[#fef0f0] border-2 border-red-300/80 rounded-2xl p-3.5 shadow-sm relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-1.5 rounded-xl bg-red-100/90 border border-red-300 text-red-800 flex-shrink-0 mt-0.5 shadow-sm">
              <ShieldAlert className="w-4 h-4 text-red-700" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-red-950 text-xs tracking-tight">
                  Account Rejected
                </h3>
                <button
                  type="button"
                  onClick={resetState}
                  className="text-red-800/60 hover:text-red-950 p-1 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-red-900/80 leading-relaxed">
                Your account request has been rejected. Please contact an administrator.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && !isPendingApproval && !isRejected && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* Google Button */}
      <GoogleButton
        onClick={triggerGoogleAuth}
        disabled={isLoading}
        className={isLoading ? "opacity-70 cursor-wait" : ""}
        text={isLoading ? "Connecting..." : "Continue with Google"}
      />

      {/* Loading Overlay Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-xs text-[#5a4836]">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Verifying with Google...</span>
        </div>
      )}
    </div>
  );
}
