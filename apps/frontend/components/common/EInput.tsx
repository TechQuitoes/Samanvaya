"use client";

import React, { forwardRef } from "react";
import { Pencil } from "lucide-react";

export type EInputSize = "sm" | "md" | "lg";

export interface EInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  inputSize?: EInputSize;
  wrapperClassName?: string;
  viewOnly?: boolean;
  onEdit?: () => void;
}

const EInput = forwardRef<HTMLInputElement, EInputProps>(
  (
    {
      label,
      error,
      required,
      icon: Icon,
      leftIcon,
      rightIcon,
      rightElement,
      inputSize = "md",
      wrapperClassName = "",
      className = "",
      viewOnly = false,
      onEdit,
      readOnly,
      ...props
    },
    ref
  ) => {
    const hasLeftIcon = Boolean(Icon || leftIcon);
    const hasRightContent = Boolean(rightIcon || rightElement || onEdit);
    const isReadOnly = viewOnly || readOnly;

    const sizeClasses: Record<EInputSize, string> = {
      sm: `h-9 text-xs rounded-xl ${hasLeftIcon ? (viewOnly ? "pl-6" : "pl-9") : viewOnly ? "pl-0" : "px-3"} ${hasRightContent ? (viewOnly ? "pr-8" : "pr-10") : ""}`,
      md: `h-11 text-xs sm:text-sm rounded-xl ${hasLeftIcon ? (viewOnly ? "pl-6" : "pl-10") : viewOnly ? "pl-0" : "px-3.5"} ${hasRightContent ? (viewOnly ? "pr-9" : "pr-12") : ""}`,
      lg: `h-13 text-sm sm:text-base rounded-2xl ${hasLeftIcon ? (viewOnly ? "pl-7" : "pl-11") : viewOnly ? "pl-0" : "px-4"} ${hasRightContent ? (viewOnly ? "pr-10" : "pr-14") : ""}`,
    };

    return (
      <div className={`space-y-1 ${wrapperClassName || "w-full"}`}>
        {label && (
          <label
            className={`block font-bold select-none ${
              viewOnly
                ? "text-[#8c7865] uppercase tracking-wider text-[10.5px]"
                : "text-xs text-[#2c221e]"
            }`}
          >
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {(leftIcon || Icon) && (
            <div
              className={`absolute ${
                viewOnly ? "left-0 text-[#174824]" : inputSize === "sm" ? "left-3 text-[#8c7865]" : "left-3.5 text-[#8c7865]"
              } pointer-events-none flex items-center justify-center z-10`}
            >
              {leftIcon ? leftIcon : Icon && <Icon className={inputSize === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
            </div>
          )}

          <input
            ref={ref}
            required={required}
            readOnly={isReadOnly}
            className={`w-full font-medium text-[#2c221e] placeholder:text-[#8c7865]/70 transition-all outline-none ${
              viewOnly
                ? "border-0 border-transparent bg-transparent text-[#2c221e] font-semibold shadow-none focus:ring-0 focus:border-transparent cursor-default select-text"
                : "border border-[#cfa35d]/80 bg-[#fbf8f2] focus:border-[#174824] focus:bg-[#fffdfa] focus:ring-2 focus:ring-[#174824]/20 shadow-2xs"
            } disabled:opacity-50 disabled:cursor-not-allowed ${
              sizeClasses[inputSize]
            } ${error ? "border-red-500 ring-1 ring-red-400" : ""} ${className}`}
            {...props}
          />

          {hasRightContent && (
            <div
              className={`absolute ${
                viewOnly ? "right-0" : inputSize === "sm" ? "right-2" : "right-2.5"
              } flex items-center gap-1 z-10`}
            >
              {rightElement}
              {rightIcon}
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#174824]/10 hover:bg-[#174824]/20 text-[#174824] transition-colors cursor-pointer"
                  title="Edit"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-red-600 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

EInput.displayName = "EInput";

export default EInput;
