"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

export interface EDateTimePickerProps {
  label?: string;
  value?: string; // ISO string e.g. "2026-08-25T15:51" or "2026-08-25"
  onChange: (value: string) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  includeTime?: boolean;
  className?: string;
  error?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_HEADER = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function EDateTimePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date & time",
  disabled = false,
  required = false,
  includeTime = true,
  className = "",
  error,
}: EDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Parse minDate & maxDate
  const parsedMinDate = minDate ? new Date(minDate) : null;
  const validMinDate = parsedMinDate && !isNaN(parsedMinDate.getTime()) ? parsedMinDate : null;

  const parsedMaxDate = maxDate ? new Date(maxDate) : null;
  const validMaxDate = parsedMaxDate && !isNaN(parsedMaxDate.getTime()) ? parsedMaxDate : null;

  // Parse initial date from value or fallback to now
  const parsedDate = value ? new Date(value) : null;
  const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  const [viewDate, setViewDate] = useState<Date>(() => validDate || validMinDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(validDate);

  // Time states (12h format)
  const initialHours = validDate ? validDate.getHours() : 16;
  const [hour12, setHour12] = useState<number>(
    initialHours === 0 ? 12 : initialHours > 12 ? initialHours - 12 : initialHours
  );
  const [minute, setMinute] = useState<number>(validDate ? validDate.getMinutes() : 0);
  const [period, setPeriod] = useState<"AM" | "PM">(initialHours >= 12 ? "PM" : "AM");

  // Keep state in sync if value prop changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewDate(d);
        const h = d.getHours();
        setHour12(h === 0 ? 12 : h > 12 ? h - 12 : h);
        setMinute(d.getMinutes());
        setPeriod(h >= 12 ? "PM" : "AM");
      }
    }
  }, [value]);

  // Smart Collision Detection & Positioning on Desktop
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const popoverHeight = 340;

    if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }

    if (window.innerWidth - rect.left < 460) {
      setAlignRight(true);
    } else {
      setAlignRight(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      updatePosition();
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Build current month calendar
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Check if a day falls outside [minDate, maxDate]
  const checkDayDisabled = (d: number, m: number, y: number) => {
    const currentDayEnd = new Date(y, m, d, 23, 59, 59, 999);
    const currentDayStart = new Date(y, m, d, 0, 0, 0, 0);

    if (validMinDate) {
      const minDayStart = new Date(
        validMinDate.getFullYear(),
        validMinDate.getMonth(),
        validMinDate.getDate(),
        0,
        0,
        0,
        0
      );
      if (currentDayEnd < minDayStart) return true;
    }
    if (validMaxDate) {
      const maxDayEnd = new Date(
        validMaxDate.getFullYear(),
        validMaxDate.getMonth(),
        validMaxDate.getDate(),
        23,
        59,
        59,
        999
      );
      if (currentDayStart > maxDayEnd) return true;
    }
    return false;
  };

  // Combine Date + Time into ISO output string
  const emitValue = (dateObj: Date, h: number, m: number, p: "AM" | "PM") => {
    let hours24 = h;
    if (p === "PM" && h < 12) hours24 += 12;
    if (p === "AM" && h === 12) hours24 = 0;

    const res = new Date(dateObj);
    res.setHours(hours24, m, 0, 0);

    const yearStr = res.getFullYear();
    const monthStr = String(res.getMonth() + 1).padStart(2, "0");
    const dayStr = String(res.getDate()).padStart(2, "0");
    const hourStr = String(res.getHours()).padStart(2, "0");
    const minStr = String(res.getMinutes()).padStart(2, "0");

    if (includeTime) {
      onChange(`${yearStr}-${monthStr}-${dayStr}T${hourStr}:${minStr}`);
    } else {
      onChange(`${yearStr}-${monthStr}-${dayStr}`);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(year, month, dayNum);
    setSelectedDate(newDate);
    emitValue(newDate, hour12, minute, period);
  };

  const handleTimeChange = (newH: number, newM: number, newP: "AM" | "PM") => {
    setHour12(newH);
    setMinute(newM);
    setPeriod(newP);
    if (selectedDate) {
      emitValue(selectedDate, newH, newM, newP);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange("");
  };

  // Formatted string for trigger display
  const formatDisplay = () => {
    if (!selectedDate) return "";
    const dateFormatted = selectedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    if (!includeTime) return dateFormatted;

    let h = hour12.toString().padStart(2, "0");
    let m = minute.toString().padStart(2, "0");
    return `${dateFormatted}, ${h}:${m} ${period}`;
  };

  // Shared Picker Content (Calendar + Time)
  const pickerContent = (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch select-none">
      {/* ─── LEFT COLUMN: CALENDAR ─── */}
      <div className="w-full sm:w-[270px] flex-shrink-0">
        {/* Header Month / Year Navigation */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e5d9c3]">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-[#faf5eb] text-[#174824] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-bold text-[#174824] tracking-wide font-serif-display">
            {MONTH_NAMES[month]} {year}
          </span>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-[#faf5eb] text-[#174824] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#8c7865] py-1.5">
          {DAYS_HEADER.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 text-center py-1 text-xs">
          {/* Prev month fill */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            return (
              <span key={`prev-${i}`} className="p-1.5 text-[#8c7865]/30 text-[11px]">
                {day}
              </span>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === dayNum &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            const isDisabled = checkDayDisabled(dayNum, month, year);

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && handleSelectDay(dayNum)}
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition-all select-none ${
                  isSelected
                    ? "bg-[#174824] text-white shadow-xs scale-105"
                    : isToday
                    ? "border border-[#174824] text-[#174824] bg-[#faf5eb]"
                    : isDisabled
                    ? "opacity-25 text-gray-400 cursor-not-allowed line-through"
                    : "text-[#2c221e] hover:bg-[#174824]/10 hover:text-[#174824] cursor-pointer"
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: TIME & DONE ─── */}
      {includeTime && (
        <div className="border-t sm:border-t-0 sm:border-l border-[#e5d9c3] pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-between w-full sm:w-[170px] space-y-3">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]/60">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Time Selection</span>
            </div>

            <div className="p-2 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-center">
              <span className="font-mono text-sm font-bold text-[#174824]">
                {hour12.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")} {period}
              </span>
            </div>

            {/* Hours & Minutes Selects */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c7865]">Hour</span>
                <select
                  value={hour12}
                  onChange={(e) => handleTimeChange(Number(e.target.value), minute, period)}
                  className="w-full h-9 px-2 rounded-xl border border-[#cfa35d] bg-[#fbf8f2] text-xs font-bold text-[#2c221e] cursor-pointer outline-none focus:border-[#174824]"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c7865]">Minute</span>
                <select
                  value={minute}
                  onChange={(e) => handleTimeChange(hour12, Number(e.target.value), period)}
                  className="w-full h-9 px-2 rounded-xl border border-[#cfa35d] bg-[#fbf8f2] text-xs font-bold text-[#2c221e] cursor-pointer outline-none focus:border-[#174824]"
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex rounded-xl border border-[#cfa35d] overflow-hidden">
              <button
                type="button"
                onClick={() => handleTimeChange(hour12, minute, "AM")}
                className={`flex-1 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  period === "AM" ? "bg-[#174824] text-white" : "bg-[#fbf8f2] text-[#5a4836]"
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handleTimeChange(hour12, minute, "PM")}
                className={`flex-1 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  period === "PM" ? "bg-[#174824] text-white" : "bg-[#fbf8f2] text-[#5a4836]"
                }`}
              >
                PM
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!selectedDate) {
                handleSelectDay(new Date().getDate());
              }
              setIsOpen(false);
            }}
            className="w-full h-9 rounded-xl bg-[#174824] hover:bg-[#174824]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer mt-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm & Done</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className={`space-y-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-[#2c221e]">
          {label} {required && <span className="text-red-600 font-bold">*</span>}
        </label>
      )}

      {/* Trigger Button Input Box */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full h-11 px-3.5 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer select-none ${
          error
            ? "border-red-500 bg-red-50/20"
            : isOpen
            ? "border-[#174824] ring-2 ring-[#174824]/20 bg-[#fffdfa] shadow-xs"
            : "border-[#cfa35d]/80 bg-[#fbf8f2] hover:border-[#174824]/40"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-amber-800 flex-shrink-0" />
          <span
            className={`truncate text-xs sm:text-sm font-medium ${
              selectedDate ? "text-[#2c221e]" : "text-[#8c7865]/70"
            }`}
          >
            {formatDisplay() || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {selectedDate && !disabled && (
            <span
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-black/5 text-[#8c7865] hover:text-[#2c221e] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </button>

      {/* 📱 1. MOBILE VIEW (< sm): Dedicated Bottom Sheet Modal with Backdrop */}
      {isOpen && (
        <div className="sm:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
          />

          {/* Bottom Sheet Modal */}
          <div className="fixed inset-x-0 bottom-0 z-[101] max-h-[92vh] overflow-y-auto bg-[#fffdfa] rounded-t-[32px] border-t border-[#e5d9c3] shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="flex justify-center pb-1">
              <div className="w-12 h-1.5 rounded-full bg-[#cfa35d]/60" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#e5d9c3]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-800" />
                <span className="font-serif-display text-sm font-bold text-[#174824]">
                  {label || "Select Date & Time"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f4ede0] hover:bg-[#e8dcbf] text-[#5a4836] flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Picker Body */}
            {pickerContent}
          </div>
        </div>
      )}

      {/* 🖥️ 2. DESKTOP VIEW (>= sm): Side-by-Side Floating Popover */}
      {isOpen && (
        <div
          className={`hidden sm:block absolute z-50 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] shadow-2xl p-4 animate-in fade-in-50 zoom-in-95 duration-100 select-none ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } ${alignRight ? "right-0" : "left-0"} max-w-[95vw]`}
        >
          {pickerContent}
        </div>
      )}

      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
    </div>
  );
}
