"use client";

import React, { useState, forwardRef } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EPasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  showLeftIcon?: boolean;
}

const EPasswordInput = forwardRef<HTMLInputElement, EPasswordInputProps>(
  (
    {
      label = "Password",
      error,
      id,
      className,
      showLeftIcon = true,
      placeholder = "Enter your password",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-[#4a3e31] select-none"
          >
            {label} {props.required && <span className="text-red-600">*</span>}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center bg-[#fcfaf5] border border-[#e4d9c6] rounded-xl px-3 h-12 focus-within:border-[#174824] transition-all",
            error && "border-red-500 focus-within:border-red-500 ring-1 ring-red-400"
          )}
        >
          {showLeftIcon && (
            <span className="mr-2 flex-shrink-0 text-[#8c7865] pointer-events-none">
              <Lock className="w-4 h-4 text-[#4a3e31]" />
            </span>
          )}

          <input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={cn(
              "w-full bg-transparent text-sm text-[#2c221e] placeholder:text-[#ab9a87] outline-none font-medium",
              className
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
            className="ml-2 flex-shrink-0 text-[#8c7865] hover:text-[#4a3e31] transition-colors p-1 cursor-pointer focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-[#4a3e31]" />
            ) : (
              <Eye className="w-4 h-4 text-[#4a3e31]" />
            )}
          </button>
        </div>

        {error && <span className="text-xs text-red-600 mt-0.5">{error}</span>}
      </div>
    );
  }
);

EPasswordInput.displayName = "EPasswordInput";

export default EPasswordInput;
