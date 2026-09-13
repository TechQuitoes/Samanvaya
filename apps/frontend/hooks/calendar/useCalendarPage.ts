"use client";

import { useState, useMemo, useCallback } from "react";
import { useCalendarMonth } from "./useCalendar";
import { Travel } from "@/types/travel";

export interface CalendarCell {
  day: number;
  isCurrentMonth: boolean;
  dateObj: Date;
  travelsOnDay: Travel[];
  isToday: boolean;
  hasTravel: boolean;
  hasSacredMeeting: boolean;
}

export function useCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed

  // Fetch from dedicated backend API
  const { data: monthData, isLoading, refetch } = useCalendarMonth(currentYear, currentMonth);

  const monthName = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const daysOfWeek = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const y = prev.getFullYear();
      const m = prev.getMonth(); // 0-indexed
      return new Date(y, m - 1, 1);
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const y = prev.getFullYear();
      const m = prev.getMonth(); // 0-indexed
      return new Date(y, m + 1, 1);
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const isDateToday = useCallback((dateObj: Date) => {
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  }, []);

  // Compute month cells dynamically
  const cells: CalendarCell[] = useMemo(() => {
    const jsMonth = currentMonth - 1;
    const firstDayIndex = new Date(currentYear, jsMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, jsMonth, 0).getDate();

    const cellList: CalendarCell[] = [];
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
        isToday: false,
        hasTravel: false,
        hasSacredMeeting: false,
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

      const isToday = isDateToday(d);
      const hasTravel = travelsOnDay.length > 0;
      const hasSacredMeeting = day === 4 || day === 15 || day === 28;

      cellList.push({
        day,
        isCurrentMonth: true,
        dateObj: d,
        travelsOnDay,
        isToday,
        hasTravel,
        hasSacredMeeting,
      });
    }

    return cellList;
  }, [currentYear, currentMonth, monthData, isDateToday]);

  const handleDateClick = useCallback((dateObj: Date) => {
    setSelectedDate(dateObj);
    setIsDrawerOpen(true);
  }, []);

  return {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    isDrawerOpen,
    setIsDrawerOpen,
    activeCategory,
    setActiveCategory,
    currentYear,
    currentMonth,
    monthName,
    daysOfWeek,
    cells,
    monthData,
    isLoading,
    refetch,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    handleDateClick,
  };
}

export default useCalendarPage;
