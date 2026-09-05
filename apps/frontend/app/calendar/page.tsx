"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Plane,
  Users,
  Clock,
  MapPin,
  Sparkles,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import DayScheduleDrawer from "@/components/calendar/DayScheduleDrawer";
import { useCalendarMonth } from "@/hooks/useCalendar";

export default function CalendarPage() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed

  // Fetch from dedicated backend API
  const { data: monthData, isLoading } = useCalendarMonth(currentYear, currentMonth);

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Compute month cells dynamically
  const { cells } = useMemo(() => {
    const jsMonth = currentMonth - 1;
    const firstDayIndex = new Date(currentYear, jsMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, jsMonth, 0).getDate();

    const cellList: Array<{
      day: number;
      isCurrentMonth: boolean;
      dateObj: Date;
      travelsOnDay: any[];
    }> = [];

    const travels = monthData?.activeTravels || [];

    // 1. Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthTotalDays - i;
      const d = new Date(currentYear, jsMonth - 1, prevDay);
      cellList.push({
        day: prevDay,
        isCurrentMonth: false,
        dateObj: d,
        travelsOnDay: [],
      });
    }

    // 2. Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(currentYear, jsMonth, day);
      const dStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const travelsOnDay = travels.filter((t) => {
        if (!t.startDate || !t.endDate) return false;
        const start = new Date(t.startDate).toISOString().slice(0, 10);
        const end = new Date(t.endDate).toISOString().slice(0, 10);
        return dStr >= start && dStr <= end;
      });

      cellList.push({
        day,
        isCurrentMonth: true,
        dateObj: d,
        travelsOnDay,
      });
    }

    return { cells: cellList };
  }, [currentYear, currentMonth, monthData]);

  const handleDateClick = (dateObj: Date) => {
    setSelectedDate(dateObj);
    setIsDrawerOpen(true);
  };

  const isToday = (dateObj: Date) => {
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  };

  return (
    <SacredPortalLayout>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs">
            <CalendarIcon className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#174824] font-serif-display">
              Master Calendar & Schedule
            </h2>
            <p className="text-xs sm:text-sm text-[#5a4836] font-medium">
              Click on any day to view and manage detailed hour-by-hour timeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/travel/create")}
            className="px-4 py-2 rounded-2xl bg-[#174824] hover:bg-[#12381c] text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Create Travel Event</span>
          </button>
        </div>
      </div>

      {/* ── Navigation Bar & Category Filter ── */}
      <Card className="rounded-[24px] border border-[#e5d9c3] bg-[#fbf8f0] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Month Picker Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#e5d9c3] rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 2, 1))}
              className="p-1.5 rounded-lg hover:bg-[#174824]/10 text-[#5a4836] hover:text-[#174824] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-xs font-bold text-[#174824] hover:bg-[#174824]/10 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(currentYear, currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-[#174824]/10 text-[#5a4836] hover:text-[#174824] transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#174824] pl-2">
            {monthName}
          </h3>
        </div>

        {/* Category Legend Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-[#5a4836]">Categories:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
            <Plane className="w-3 h-3 text-emerald-700" />
            <span>Travel</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100/80 text-purple-900 border border-purple-300 text-[10px] font-bold">
            <Users className="w-3 h-3 text-purple-700" />
            <span>Meetings</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Satsang</span>
          </span>
        </div>
      </Card>

      {/* ── Main Month Grid ── */}
      <Card className="rounded-[28px] border border-[#e5d9c3] bg-[#fffdfa] p-4 sm:p-6 shadow-sm overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center pb-2 border-b border-[#e5d9c3]">
          {daysOfWeek.map((day) => (
            <span
              key={day}
              className="text-xs font-bold text-[#8c7865] uppercase tracking-wider"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Month Day Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
          {cells.map((cell, idx) => {
            const today = isToday(cell.dateObj) && cell.isCurrentMonth;
            const hasTravel = cell.travelsOnDay.length > 0;

            return (
              <div
                key={idx}
                onClick={() => cell.isCurrentMonth && handleDateClick(cell.dateObj)}
                className={`min-h-[85px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? "bg-[#faf5eb]/40 border-transparent text-[#b5a796] opacity-30 cursor-default"
                    : today
                    ? "bg-[#f4ede0] border-[#174824] shadow-xs cursor-pointer hover:border-[#174824] hover:shadow-md"
                    : "bg-[#fbf8f0]/80 border-[#e5d9c3]/70 hover:bg-white hover:border-[#174824]/40 hover:shadow-sm cursor-pointer"
                }`}
              >
                {/* Cell Top: Day Number + Today Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-lg ${
                      today
                        ? "bg-[#174824] text-white"
                        : cell.isCurrentMonth
                        ? "text-[#2c221e]"
                        : "text-[#b5a796]"
                    }`}
                  >
                    {cell.day}
                  </span>

                  {hasTravel && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  )}
                </div>

                {/* Cell Events List (Compact) */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {cell.travelsOnDay.slice(0, 2).map((t) => (
                    <div
                      key={t._id}
                      className="px-1.5 py-0.5 rounded-lg bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-[9.5px] font-bold truncate flex items-center gap-1"
                      title={t.title}
                    >
                      <Plane className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{t.destinationCity}</span>
                    </div>
                  ))}

                  {/* Recurring Program indicator for sacred days */}
                  {cell.isCurrentMonth && (cell.day === 4 || cell.day === 15 || cell.day === 28) && (
                    <div className="px-1.5 py-0.5 rounded-lg bg-purple-100/90 text-purple-900 border border-purple-300 text-[9.5px] font-bold truncate flex items-center gap-1">
                      <Users className="w-2.5 h-2.5 text-purple-700 shrink-0" />
                      <span className="truncate">Leadership Meeting</span>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                {cell.isCurrentMonth && (
                  <span className="text-[9px] text-[#8c7865] font-semibold text-right opacity-0 hover:opacity-100 transition-opacity">
                    View
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Responsive Day Schedule Timeline Drawer ── */}
      <DayScheduleDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedDate={selectedDate}
        travels={monthData?.activeTravels}
      />
    </SacredPortalLayout>
  );
}
