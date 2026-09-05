"use client";

import { useState, useEffect, useCallback } from "react";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { Travel } from "@/types/travel";

export interface MonthSummaryItem {
  dateStr: string;
  hasTravel: boolean;
  travelCount: number;
  eventCount: number;
  categories: string[];
}

export interface MonthEventsResponse {
  year: number;
  month: number;
  daysSummary: Record<string, MonthSummaryItem>;
  activeTravels: Travel[];
}

export interface DayScheduleResponse {
  dateStr: string;
  travels: Travel[];
  tasks: any[];
  customEvents: any[];
}

export function useCalendarMonth(year?: number, month?: number) {
  const currentYear = year || new Date().getFullYear();
  const currentMonth = month || new Date().getMonth() + 1;

  const [data, setData] = useState<MonthEventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiNexus.call<MonthEventsResponse>("GET_CALENDAR_MONTH", {
        queryParams: { year: currentYear, month: currentMonth },
      });
      if (res.isSuccess && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.warn("Failed to load month calendar:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  return { data, isLoading, refetch: fetchMonth };
}

export function useCalendarDay(dateStr?: string) {
  const [data, setData] = useState<DayScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDay = useCallback(async (targetDate?: string) => {
    const d = targetDate || dateStr || new Date().toISOString().slice(0, 10);
    setIsLoading(true);
    try {
      const res = await apiNexus.call<DayScheduleResponse>("GET_CALENDAR_DAY", {
        queryParams: { date: d },
      });
      if (res.isSuccess && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.warn("Failed to load day schedule:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    if (dateStr) {
      fetchDay(dateStr);
    }
  }, [dateStr, fetchDay]);

  return { data, isLoading, fetchDay };
}
