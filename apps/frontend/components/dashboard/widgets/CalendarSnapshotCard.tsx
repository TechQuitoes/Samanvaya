"use client";

import React, { useState } from "react";
import ECard from "@/components/ui/ECard";

export interface CalendarSnapshotProps {
  monthName?: string;
  selectedDate?: number;
  onDateSelect?: (date: number) => void;
}

export default function CalendarSnapshotCard({
  monthName = "April 2024",
  selectedDate: initialSelected = 28,
  onDateSelect,
}: CalendarSnapshotProps) {
  const [selectedDate, setSelectedDate] = useState<number>(initialSelected);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // April 2024: April 1 starts on Monday (index 1), with 30 days. Trailing Sunday is 31 (March).
  const calendarCells = [
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
  ];

  const handleSelect = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    setSelectedDate(day);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  return (
    <ECard
      title="Calendar Snapshot"
      className="h-full"
      contentClassName="flex flex-col justify-between"
    >
      {/* Month & Year Header */}
      <div className="text-center mb-2">
        <h4 className="text-xs sm:text-sm font-bold text-[#2c221e] tracking-wide">
          {monthName}
        </h4>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 text-center mb-1">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="text-[11px] font-semibold text-[#8c7865]"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {calendarCells.map((cell, index) => {
          const isSelected = cell.isCurrentMonth && cell.day === selectedDate;

          return (
            <div
              key={index}
              className="flex items-center justify-center py-0.5"
            >
              <button
                type="button"
                onClick={() => handleSelect(cell.day, cell.isCurrentMonth)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs rounded-lg transition-all duration-150 cursor-pointer ${
                  !cell.isCurrentMonth
                    ? "text-[#b5a796] opacity-60 cursor-default"
                    : isSelected
                    ? "bg-[#174824] text-white font-bold shadow-xs scale-105"
                    : "text-[#2c221e] font-medium hover:bg-[#174824]/10"
                }`}
              >
                {cell.day}
              </button>
            </div>
          );
        })}
      </div>
    </ECard>
  );
}
