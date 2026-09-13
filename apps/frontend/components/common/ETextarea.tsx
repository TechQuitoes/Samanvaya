"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ETextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

const ETextarea = forwardRef<HTMLTextAreaElement, ETextareaProps>(
  (
    {
      label,
      error,
      required,
      wrapperClassName = "",
      className = "",
      rows = 3,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-1.5 w-full", wrapperClassName)}>
        {label && (
          <label className="block text-xs font-bold text-[#2c221e]">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          required={required}
          rows={rows}
          className={cn(
            "w-full border border-[#cfa35d]/80 bg-[#fbf8f2] font-medium text-[#2c221e] text-xs sm:text-sm rounded-xl p-3 placeholder:text-[#8c7865]/70 transition-all outline-none focus:outline-none focus:border-[#174824] focus:bg-[#fffdfa] focus:ring-2 focus:ring-[#174824]/20 shadow-2xs resize-none disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-500 ring-1 ring-red-400" : "",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-[11px] text-red-600 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

ETextarea.displayName = "ETextarea";

export default ETextarea;
