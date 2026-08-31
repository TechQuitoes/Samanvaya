"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface ESelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ESelectProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options: (ESelectOption | string)[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  className?: string;
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
  error,
}: ESelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: ESelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-[#2c221e]">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full h-11 px-3.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer select-none shadow-2xs ${
          isOpen
            ? "border-[#174824] bg-[#fffdfa] ring-2 ring-[#174824]/20"
            : "border-[#cfa35d]/80 bg-[#fbf8f2] hover:bg-[#fffdfa] hover:border-[#174824]/60"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
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
          className={`w-4 h-4 text-[#8c7865] transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-[#174824]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100 max-h-64 flex flex-col">
          {/* Optional Search Bar */}
          {searchable && (
            <div className="p-2 border-b border-[#e5d9c3]/70 bg-[#faf5eb]">
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
                    className="absolute right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 flex-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#8c7865]">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-[#174824] text-white font-bold shadow-2xs"
                        : "text-[#2c221e] hover:bg-[#faf5eb] hover:text-[#174824]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isSelected ? "text-amber-300" : "text-[#174824]"
                          }`}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate">{opt.label}</p>
                        {opt.sublabel && (
                          <p
                            className={`text-[10px] truncate ${
                              isSelected ? "text-amber-200/90" : "text-[#8c7865]"
                            }`}
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
        </div>
      )}

      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
