import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, leftIcon, rightIcon, error, id, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-[#4a3e31]">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center bg-[#fcfaf5] border border-[#e4d9c6] rounded-xl px-3 h-12 focus-within:border-[#174824] transition-all",
            error && "border-red-500 focus-within:border-red-500"
          )}
        >
          {leftIcon && (
            <span className="mr-2 flex-shrink-0 text-[#8c7865]">{leftIcon}</span>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full bg-transparent text-sm text-[#2c221e] placeholder:text-[#ab9a87] outline-none font-medium",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="ml-2 flex-shrink-0 text-[#8c7865]">{rightIcon}</span>
          )}
        </div>
        {error && <span className="text-xs text-red-600 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
