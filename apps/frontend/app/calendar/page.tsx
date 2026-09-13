"use client";

import React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plane,
  Users,
  Sparkles,
} from "lucide-react";
import ECard from "@/components/common/ECard";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import DayScheduleDrawer from "@/components/calendar/DayScheduleDrawer";
import { useCalendarPage } from "@/hooks/calendar";

export default function CalendarPage() {
  const {
    monthName,
    daysOfWeek,
    cells,
    monthData,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedDate,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    handleDateClick,
  } = useCalendarPage();

  return (
    <SacredPortalLayout
      title="Master Calendar & Schedule"
      subtitle="Click on any day to view and manage detailed hour-by-hour timeline"
      icon={CalendarIcon}
    >
      {/* ── Navigation Bar & Category Filter ── */}
      <ECard className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Month Picker Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#e5d9c3] rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg hover:bg-[#174824]/10 text-[#5a4836] hover:text-[#174824] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-bold text-[#174824] hover:bg-[#174824]/10 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
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
      </ECard>

      {/* ── Main Month Grid ── */}
      <ECard className="p-4 sm:p-6 overflow-hidden">
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
            const today = cell.isToday && cell.isCurrentMonth;
            const hasTravel = cell.hasTravel;

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
                  {cell.isCurrentMonth && cell.hasSacredMeeting && (
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
      </ECard>

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
