"use client";

import React, { forwardRef } from "react";
import { Phone, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export type EMobileInputSize = "sm" | "md" | "lg";

export interface EMobileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  showLeftIcon?: boolean;
  leftIcon?: React.ReactNode;
  countryCode?: string;
  inputSize?: EMobileInputSize;
  wrapperClassName?: string;
  viewOnly?: boolean;
  onEdit?: () => void;
  rightElement?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const EMobileInput = forwardRef<HTMLInputElement, EMobileInputProps>(
  (
    {
      label = "Mobile Number",
      error,
      id,
      className,
      wrapperClassName,
      showLeftIcon = true,
      leftIcon,
      countryCode = "+91",
      inputSize = "md",
      viewOnly = false,
      onEdit,
      rightElement,
      rightIcon,
      placeholder = "Enter mobile number",
      required,
      readOnly,
      ...props
    },
    ref
  ) => {
    const isReadOnly = viewOnly || readOnly;
    const hasRightContent = Boolean(rightIcon || rightElement || onEdit);

    const stringVal = typeof props.value === "string" ? props.value : "";
    const hasPlusPrefix = stringVal.trim().startsWith("+");
    const shouldShowCountryCode = Boolean(countryCode && !hasPlusPrefix);

    const sizeClasses: Record<
      EMobileInputSize,
      { container: string; icon: string; input: string }
    > = {
      sm: {
        container: "h-9 rounded-xl px-2.5",
        icon: "w-3.5 h-3.5",
        input: "text-xs",
      },
      md: {
        container: "h-11 sm:h-12 rounded-xl px-3",
        icon: "w-4 h-4",
        input: "text-xs sm:text-sm",
      },
      lg: {
        container: "h-13 rounded-2xl px-4",
        icon: "w-4 h-4",
        input: "text-sm sm:text-base",
      },
    };

    return (
      <div className={cn("flex flex-col gap-1 w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "font-semibold select-none",
              viewOnly
                ? "text-[#8c7865] uppercase tracking-wider text-[10.5px]"
                : "text-xs text-[#4a3e31]"
            )}
          >
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center transition-all",
            viewOnly
              ? "border-0 border-transparent bg-transparent pl-0 h-auto cursor-default"
              : cn(
                  "bg-[#fcfaf5] border border-[#e4d9c6] focus-within:border-[#174824] focus-within:ring-2 focus-within:ring-[#174824]/20",
                  sizeClasses[inputSize].container,
                  error &&
                    "border-red-500 focus-within:border-red-500 ring-1 ring-red-400"
                )
          )}
        >
          {showLeftIcon && (
            <span
              className={cn(
                "mr-2 flex-shrink-0 pointer-events-none flex items-center",
                viewOnly ? "text-[#174824]" : "text-[#8c7865]"
              )}
            >
              {leftIcon || (
                <Phone
                  className={cn(
                    sizeClasses[inputSize].icon,
                    viewOnly ? "text-[#174824]" : "text-[#4a3e31]"
                  )}
                />
              )}
            </span>
          )}

          {shouldShowCountryCode && (
            <span
              className={cn(
                "select-none flex-shrink-0 font-bold",
                viewOnly
                  ? "text-sm font-semibold text-[#174824] mr-1.5"
                  : "text-xs text-[#5a4836] pr-2 mr-2 border-r border-[#e4d9c6]"
              )}
            >
              {countryCode}
            </span>
          )}

          <input
            id={id}
            ref={ref}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            readOnly={isReadOnly}
            required={required}
            placeholder={placeholder}
            className={cn(
              "w-full bg-transparent text-[#2c221e] outline-none font-medium placeholder:text-[#ab9a87]",
              sizeClasses[inputSize].input,
              viewOnly && "font-semibold cursor-default select-text",
              className
            )}
            {...props}
          />

          {hasRightContent && (
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
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

        {error && <span className="text-xs text-red-600 mt-0.5">{error}</span>}
      </div>
    );
  }
);

EMobileInput.displayName = "EMobileInput";

export default EMobileInput;
