"use client";

import React, { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ESelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface ESelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: (ESelectOption | string)[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  className?: string;
  triggerClassName?: string;
  trigger?: React.ReactNode;
  align?: "start" | "end" | "center";
  menuWidth?: string;
  error?: string;
}

export default function ESelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  searchable = false,
  className = "",
  triggerClassName,
  trigger,
  align = "start",
  menuWidth,
  error,
}: ESelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Normalize options to object format
  const normalizedOptions: ESelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = normalizedOptions.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.sublabel &&
        opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (opt: ESelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (opt.disabled) return;

    if (opt.onClick) {
      opt.onClick();
    }
    if (onChange) {
      onChange(opt.value);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const SelectedIcon = selectedOption?.icon;

  return (
    <div
      className={cn(
        "space-y-1.5",
        trigger ? "inline-block" : "w-full",
        className
      )}
    >
      {label && (
        <label className="block text-xs font-bold text-[#2c221e]">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <PopoverPrimitive.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!disabled) {
            setIsOpen(open);
            if (!open) setSearchQuery("");
          }
        }}
      >
        <PopoverPrimitive.Trigger asChild>
          {trigger ? (
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={cn(
                "p-1.5 rounded-lg hover:bg-black/5 text-[#5a4836] cursor-pointer transition-colors inline-flex items-center justify-center select-none outline-none focus:outline-none",
                triggerClassName
              )}
            >
              {trigger}
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={cn(
                "w-full h-11 px-3.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer select-none shadow-2xs outline-none focus:outline-none",
                isOpen
                  ? "border-[#174824] bg-[#fffdfa] ring-2 ring-[#174824]/20"
                  : "border-[#cfa35d]/80 bg-[#fbf8f2] hover:bg-[#fffdfa] hover:border-[#174824]/60",
                disabled && "opacity-50 cursor-not-allowed bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {SelectedIcon && (
                  <SelectedIcon className="w-4 h-4 text-[#174824] flex-shrink-0" />
                )}
                {selectedOption ? (
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-[#2c221e] truncate block">
                      {selectedOption.label}
                    </span>
                    {selectedOption.sublabel && (
                      <span className="text-[10px] text-[#8c7865] truncate block">
                        {selectedOption.sublabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm text-[#8c7865]/70 font-normal truncate">
                    {placeholder}
                  </span>
                )}
              </div>

              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#8c7865] transition-transform duration-200 flex-shrink-0 ml-2",
                  isOpen && "rotate-180 text-[#174824]"
                )}
              />
            </button>
          )}
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align={align}
            sideOffset={6}
            collisionPadding={12}
            avoidCollisions={true}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "z-50 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] shadow-xl overflow-hidden popover-content outline-none focus:outline-none flex flex-col max-h-64",
              trigger
                ? menuWidth || "w-48 sm:w-52"
                : "w-[var(--radix-popover-trigger-width)]"
            )}
          >
            {/* Optional Search Bar */}
            {searchable && (
              <div className="p-2 border-b border-[#e5d9c3]/70 bg-[#faf5eb] shrink-0">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-[#8c7865] absolute left-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-8 pl-8 pr-7 rounded-lg bg-white border border-[#e5d9c3] text-xs text-[#2c221e] focus:outline-none focus:border-[#174824]"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto p-1.5 space-y-0.5 flex-1 overscroll-contain">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#8c7865]">
                  No options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = value !== undefined && opt.value === value;
                  const Icon = opt.icon;
                  const isDestructive = opt.destructive;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={(e) => handleSelect(opt, e)}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-all cursor-pointer select-none outline-none",
                        opt.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : isDestructive
                          ? "text-red-700 hover:bg-red-50 hover:text-red-800"
                          : isSelected
                          ? "bg-[#174824] text-white font-bold shadow-2xs"
                          : "text-[#2c221e] hover:bg-[#faf5eb] hover:text-[#174824]"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {Icon && (
                          <Icon
                            className={cn(
                              "w-4 h-4 flex-shrink-0",
                              isSelected
                                ? "text-amber-300"
                                : isDestructive
                                ? "text-red-600"
                                : "text-[#174824]"
                            )}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate">{opt.label}</p>
                          {opt.sublabel && (
                            <p
                              className={cn(
                                "text-[10px] truncate",
                                isSelected
                                  ? "text-amber-200/90"
                                  : isDestructive
                                  ? "text-red-400"
                                  : "text-[#8c7865]"
                              )}
                            >
                              {opt.sublabel}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-amber-300 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}

export const EDropdown = ESelect;
