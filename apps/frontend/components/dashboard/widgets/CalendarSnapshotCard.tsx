"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import ECard from "@/components/ui/ECard";
import DayScheduleDrawer from "@/components/calendar/DayScheduleDrawer";
import { useCalendarMonth } from "@/hooks/useCalendar";

export interface CalendarSnapshotProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function CalendarSnapshotCard({
  initialDate = new Date(),
  onDateSelect,
}: CalendarSnapshotProps) {
  // Navigation Month State
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(initialDate));
  const [selectedDayDate, setSelectedDayDate] = useState<Date>(() => new Date(initialDate));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed for API (1 to 12)

  // Fetch Month Data from dedicated Backend Calendar API
  const { data: monthData, isLoading } = useCalendarMonth(currentYear, currentMonth);

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Compute month cells dynamically
  const { cells } = useMemo(() => {
    const jsMonth = currentMonth - 1;
    const firstDayIndex = new Date(currentYear, jsMonth, 1).getDay(); // 0 for Sunday
    const totalDays = new Date(currentYear, currentMonth, 0).getDate(); // e.g. 30 / 31
    const prevMonthTotalDays = new Date(currentYear, jsMonth, 0).getDate();

    const cellList: Array<{
      day: number;
      isCurrentMonth: boolean;
      dateObj: Date;
      hasEvent: boolean;
      hasTravel: boolean;
      dotColor?: string;
    }> = [];

    const daysSummary = monthData?.daysSummary || {};

    // 1. Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthTotalDays - i;
      const d = new Date(currentYear, jsMonth - 1, prevDay);
      cellList.push({
        day: prevDay,
        isCurrentMonth: false,
        dateObj: d,
        hasEvent: false,
        hasTravel: false,
      });
    }

    // 2. Days of the current month
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(currentYear, jsMonth, day);
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayInfo = daysSummary[dateStr];

      const hasTravel = !!dayInfo?.hasTravel;
      const hasEvent = (dayInfo?.eventCount || 0) > 0;

      let dotColor: string | undefined = undefined;
      if (hasTravel) {
        dotColor = "bg-emerald-500";
      } else if (dayInfo?.categories?.includes("MEETING")) {
        dotColor = "bg-purple-500";
      } else if (hasEvent) {
        dotColor = "bg-blue-500";
      }

      cellList.push({
        day,
        isCurrentMonth: true,
        dateObj: d,
        hasEvent,
        hasTravel,
        dotColor,
      });
    }

    return { cells: cellList };
  }, [currentYear, currentMonth, monthData]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  const handleDateClick = (dateObj: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    setSelectedDayDate(dateObj);
    setIsDrawerOpen(true);
    onDateSelect?.(dateObj);
  };

  const isToday = (dateObj: Date) => {
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (dateObj: Date) => {
    return (
      dateObj.getDate() === selectedDayDate.getDate() &&
      dateObj.getMonth() === selectedDayDate.getMonth() &&
      dateObj.getFullYear() === selectedDayDate.getFullYear()
    );
  };

  return (
    <>
      <ECard
        title="Calendar Snapshot"
        className="h-full"
        headerAction={
          <Link
            href="/calendar"
            className="text-xs font-semibold text-[#174824] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
        contentClassName="flex flex-col justify-between space-y-2"
      >
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between py-1 px-0.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-[#174824]/10 text-[#5a4836] hover:text-[#174824] transition-colors cursor-pointer"
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <h4 className="text-xs sm:text-sm font-bold text-[#2c221e] tracking-wide font-serif-display">
            {monthName}
          </h4>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-[#174824]/10 text-[#5a4836] hover:text-[#174824] transition-colors cursor-pointer"
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekdays Header */}
        <div className="grid grid-cols-7 text-center">
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
          {cells.map((cell, index) => {
            const selected = isSelected(cell.dateObj) && cell.isCurrentMonth;
            const today = isToday(cell.dateObj) && cell.isCurrentMonth;

            return (
              <div
                key={index}
                className="flex items-center justify-center py-0.5 relative"
              >
                <button
                  type="button"
                  onClick={() => handleDateClick(cell.dateObj, cell.isCurrentMonth)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs rounded-xl transition-all duration-150 cursor-pointer relative ${
                    !cell.isCurrentMonth
                      ? "text-[#b5a796] opacity-35 cursor-default pointer-events-none"
                      : selected
                      ? "bg-[#174824] text-white font-bold shadow-xs scale-105"
                      : today
                      ? "border border-[#174824] text-[#174824] font-bold bg-[#174824]/5"
                      : "text-[#2c221e] font-medium hover:bg-[#174824]/10"
                  }`}
                  title={`${cell.dateObj.toLocaleDateString()} — Click to view day schedule`}
                >
                  {cell.day}
                  {cell.hasEvent && !selected && (
                    <span
                      className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${
                        cell.dotColor || "bg-emerald-500"
                      }`}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </ECard>

      {/* ── Dynamic Day Schedule Timeline Drawer / Bottom Sheet ── */}
      <DayScheduleDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedDate={selectedDayDate}
        travels={monthData?.activeTravels}
      />
    </>
  );
}
