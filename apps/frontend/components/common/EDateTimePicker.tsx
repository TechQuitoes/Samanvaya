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

  // Parse initial date from value or fallback to now
  const parsedDate = value ? new Date(value) : null;
  const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  const [viewDate, setViewDate] = useState<Date>(() => validDate || new Date());
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

  // Smart Collision Detection & Positioning (Flip Upward / Downward & Left / Right)
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const popoverHeight = 340; // approx height of side-by-side picker

    // If not enough space below (less than 350px) but more space above, open upward
    if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }

    // Horizontal alignment (if too close to right edge)
    const popoverWidth = includeTime ? 460 : 280;
    if (rect.left + popoverWidth > window.innerWidth - 20) {
      setAlignRight(true);
    } else {
      setAlignRight(false);
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  // Format display string
  const formatDisplay = (d: Date | null): string => {
    if (!d) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = MONTH_NAMES[d.getMonth()].substring(0, 3);
    const year = d.getFullYear();

    if (!includeTime) {
      return `${day} ${month} ${year}`;
    }

    const h = d.getHours();
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";

    return `${day} ${month} ${year}, ${h12.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  // Convert selected day + time to ISO string
  const emitChange = (dateObj: Date, h12: number, min: number, ampm: "AM" | "PM") => {
    let hours24 = h12 % 12;
    if (ampm === "PM") hours24 += 12;

    const finalDate = new Date(dateObj);
    finalDate.setHours(hours24, min, 0, 0);

    const year = finalDate.getFullYear();
    const month = (finalDate.getMonth() + 1).toString().padStart(2, "0");
    const day = finalDate.getDate().toString().padStart(2, "0");
    const hh = finalDate.getHours().toString().padStart(2, "0");
    const mm = finalDate.getMinutes().toString().padStart(2, "0");

    const isoLocal = includeTime ? `${year}-${month}-${day}T${hh}:${mm}` : `${year}-${month}-${day}`;
    onChange(isoLocal);
  };

  // Calendar Math
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(year, month, dayNum);
    setSelectedDate(newDate);
    emitChange(newDate, hour12, minute, period);
  };

  const handleTimeChange = (newH: number, newM: number, newPeriod: "AM" | "PM") => {
    setHour12(newH);
    setMinute(newM);
    setPeriod(newPeriod);
    const targetDate = selectedDate || new Date();
    setSelectedDate(targetDate);
    emitChange(targetDate, newH, newM, newPeriod);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange("");
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-[#2c221e]">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* Display Input Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full h-11 px-3.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer select-none shadow-2xs outline-none focus:outline-none ${
          isOpen
            ? "border-[#174824] bg-[#fffdfa] ring-2 ring-[#174824]/20"
            : "border-[#cfa35d]/80 bg-[#fbf8f2] hover:bg-[#fffdfa] hover:border-[#174824]/60"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <CalendarIcon className="w-4 h-4 text-amber-700 flex-shrink-0" />
          {selectedDate ? (
            <span className="text-xs sm:text-sm font-medium text-[#2c221e] truncate">
              {formatDisplay(selectedDate)}
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-[#8c7865]/70 font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {selectedDate && (
            <span
              onClick={handleClear}
              className="p-1 hover:text-red-600 text-gray-400 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </button>

      {/* Sacred Calendar & Time Picker Popover (Smart Positioning + 2-Column Side-by-Side) */}
      {isOpen && (
        <div
          className={`absolute z-50 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] shadow-2xl p-4 animate-in fade-in-50 zoom-in-95 duration-100 select-none ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } ${alignRight ? "right-0" : "left-0"} max-w-[95vw]`}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* ─── LEFT COLUMN: CALENDAR ─── */}
            <div className="w-[260px] sm:w-[270px] flex-shrink-0">
              {/* Header Month / Year Navigation */}
              <div className="flex items-center justify-between pb-2 border-b border-[#e5d9c3]">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 rounded-lg hover:bg-[#faf5eb] text-[#174824] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs sm:text-sm font-bold text-[#174824] tracking-wide font-serif-display">
                  {MONTH_NAMES[month]} {year}
                </span>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 rounded-lg hover:bg-[#faf5eb] text-[#174824] transition-colors cursor-pointer"
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
                    <span key={`prev-${i}`} className="p-1.5 text-[#8c7865]/40 text-[11px]">
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

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      onClick={() => handleSelectDay(dayNum)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer select-none ${
                        isSelected
                          ? "bg-[#174824] text-white shadow-xs scale-105"
                          : isToday
                          ? "border border-[#174824] text-[#174824] bg-[#faf5eb]"
                          : "text-[#2c221e] hover:bg-[#174824]/10 hover:text-[#174824]"
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT COLUMN: TIME & DONE (Side-by-side) ─── */}
            {includeTime && (
              <div className="border-t sm:border-t-0 sm:border-l border-[#e5d9c3] pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-between w-full sm:w-[170px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]/60">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Time</span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-center">
                    <span className="font-mono text-sm font-bold text-[#174824]">
                      {hour12.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")} {period}
                    </span>
                  </div>

                  {/* Hours & Minutes Selects */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#8c7865]">Hour</span>
                      <select
                        value={hour12}
                        onChange={(e) => handleTimeChange(Number(e.target.value), minute, period)}
                        className="w-full h-8 px-2 rounded-xl border border-[#cfa35d] bg-[#fbf8f2] text-xs font-bold text-[#2c221e] cursor-pointer outline-none focus:border-[#174824]"
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
                        className="w-full h-8 px-2 rounded-xl border border-[#cfa35d] bg-[#fbf8f2] text-xs font-bold text-[#2c221e] cursor-pointer outline-none focus:border-[#174824]"
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
                      className={`flex-1 py-1 text-xs font-bold transition-colors cursor-pointer text-center ${
                        period === "AM" ? "bg-[#174824] text-white" : "bg-[#fbf8f2] text-[#5a4836] hover:bg-[#faf5eb]"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTimeChange(hour12, minute, "PM")}
                      className={`flex-1 py-1 text-xs font-bold transition-colors cursor-pointer text-center ${
                        period === "PM" ? "bg-[#174824] text-white" : "bg-[#fbf8f2] text-[#5a4836] hover:bg-[#faf5eb]"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>

                {/* Done Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 rounded-xl bg-[#174824] text-white text-xs font-bold hover:bg-[#174824]/90 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
