"use client";

import React, { forwardRef } from "react";

export interface EInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const EInput = forwardRef<HTMLInputElement, EInputProps>(
  ({ label, error, required, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-bold text-[#2c221e]">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-[#8c7865] pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            required={required}
            className={`w-full h-11 ${
              Icon ? "pl-10 pr-3.5" : "px-3.5"
            } rounded-xl border border-[#cfa35d]/80 bg-[#fbf8f2] text-xs sm:text-sm font-medium text-[#2c221e] placeholder:text-[#8c7865]/70 transition-all outline-none focus:outline-none focus:border-[#174824] focus:bg-[#fffdfa] focus:ring-2 focus:ring-[#174824]/20 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? "border-red-500 ring-1 ring-red-400" : ""
            } ${className}`}
            {...props}
          />
        </div>

        {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
      </div>
    );
  }
);

EInput.displayName = "EInput";

export default EInput;
