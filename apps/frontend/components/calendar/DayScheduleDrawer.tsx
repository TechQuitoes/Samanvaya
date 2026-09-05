"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Train,
  Car,
  Bus,
  Users,
  Building,
  Clock,
  MapPin,
  Plus,
  ChevronRight,
  CheckSquare,
  Loader2,
  CalendarX2,
  Phone,
  Luggage,
  Navigation,
} from "lucide-react";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import { Travel } from "@/types/travel";
import { useCalendarDay } from "@/hooks/useCalendar";

interface DayScheduleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  travels?: Travel[];
  onAddEvent?: () => void;
}

export default function DayScheduleDrawer({
  open,
  onOpenChange,
  selectedDate,
  travels: propTravels = [],
  onAddEvent,
}: DayScheduleDrawerProps) {
  const router = useRouter();

  const dateStr = selectedDate.toISOString().slice(0, 10);
  const { data: dayData, isLoading, fetchDay } = useCalendarDay(dateStr);

  useEffect(() => {
    if (open) {
      fetchDay(dateStr);
    }
  }, [open, dateStr, fetchDay]);

  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const formattedFullDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const travels = dayData?.travels || propTravels;
  const tasks = dayData?.tasks || [];
  const customEvents = dayData?.customEvents || [];

  const hasAnything = travels.length > 0 || tasks.length > 0 || customEvents.length > 0;

  const getModeIcon = (mode?: string) => {
    switch (mode) {
      case "FLIGHT": return Plane;
      case "TRAIN": return Train;
      case "CAR":
      case "PICKUP": return Car;
      case "BUS": return Bus;
      default: return Navigation;
    }
  };

  const formatTime = (d?: Date | string) => {
    if (!d) return null;
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <EResponsiveDrawer
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={
        <div className="flex flex-col">
          <span className="font-serif-display text-base sm:text-lg font-bold text-[#174824]">
            {dayName}
          </span>
          <span className="text-xs font-semibold text-[#5a4836]">
            {formattedFullDate}
          </span>
        </div>
      }
    >
      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#174824]" />
            <p className="text-xs font-bold text-[#5a4836]">Loading...</p>
          </div>
        ) : !hasAnything ? (
          /* ── Empty State ── */
          <div className="py-16 px-4 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#174824]/10 text-[#174824] flex items-center justify-center">
              <CalendarX2 className="w-7 h-7 text-[#2d6a4f]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#174824] font-serif-display">
                No Schedule for this Day
              </h3>
              <p className="text-xs text-[#5a4836] max-w-xs mx-auto">
                No travel or tasks scheduled for this date.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onOpenChange(false); router.push("/travel/create"); }}
                className="px-4 py-2 rounded-xl bg-[#174824] hover:bg-[#12381c] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>Create Travel</span>
              </button>
              <button
                type="button"
                onClick={() => { onOpenChange(false); router.push("/tasks"); }}
                className="px-4 py-2 rounded-xl border border-[#e5d9c3] bg-white hover:bg-[#faf5eb] text-[#5a4836] text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#174824]" />
                <span>Assign Task</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">

            {/* ═══════════ TRAVEL CARDS (raw DB records) ═══════════ */}
            {travels.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#5a4836] uppercase tracking-wider">
                  Travels ({travels.length})
                </h3>
                {travels.map((t: any) => {
                  const transport = t.transportDetails?.[0];
                  const ModeIcon = getModeIcon(transport?.mode);

                  return (
                    <div
                      key={t._id}
                      className="rounded-2xl border border-emerald-200 bg-[#eef7ee] p-4 space-y-3 cursor-pointer hover:bg-[#e4f3e4] transition-colors group"
                      onClick={() => { onOpenChange(false); router.push(`/travel/${t._id}`); }}
                    >
                      {/* Travel Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-xl bg-[#174824] text-white shrink-0">
                            <ModeIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#174824] truncate">{t.title}</h4>
                            <p className="text-xs text-[#2d6a4f] flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{t.fromLocation} → {t.destinationCity}</span>
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#174824]/40 group-hover:text-[#174824] group-hover:translate-x-0.5 transition-all self-center shrink-0" />
                      </div>

                      {/* Transport Details (only if they exist in DB) */}
                      {transport && (
                        <div className="bg-white/60 rounded-xl p-3 space-y-1.5">
                          {transport.mode === "FLIGHT" && transport.airline && (
                            <p className="text-xs text-[#174824] font-semibold">
                              ✈️ {transport.airline} {transport.flightNo || ""}
                              {transport.pnr ? ` • PNR: ${transport.pnr}` : ""}
                            </p>
                          )}
                          {transport.mode === "TRAIN" && transport.trainNameNo && (
                            <p className="text-xs text-[#174824] font-semibold">
                              🚂 {transport.trainNameNo}
                              {transport.coachSeat ? ` • ${transport.coachSeat}` : ""}
                            </p>
                          )}
                          {(transport.mode === "CAR" || transport.mode === "PICKUP") && (
                            <p className="text-xs text-[#174824] font-semibold">
                              🚗 {transport.vehicleNo || transport.cabProvider || transport.driverName || "Road Transit"}
                              {transport.driverPhone ? ` • ${transport.driverPhone}` : ""}
                            </p>
                          )}
                          {transport.mode === "BUS" && (
                            <p className="text-xs text-[#174824] font-semibold">
                              🚌 {transport.busOperator || "Bus"}
                              {transport.seatNo ? ` • Seat: ${transport.seatNo}` : ""}
                            </p>
                          )}
                          {/* Departure & Arrival times — only if saved in DB */}
                          <div className="flex items-center gap-3 text-[11px] text-[#2d6a4f]">
                            {transport.departureTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Dep: {formatTime(transport.departureTime)}
                              </span>
                            )}
                            {transport.arrivalTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Arr: {formatTime(transport.arrivalTime)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stay Details (only if they exist in DB) */}
                      {t.stayDetails?.name && (
                        <div className="bg-white/60 rounded-xl p-3 flex items-start gap-2">
                          <Building className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#4a2870]">{t.stayDetails.name}</p>
                            {t.stayDetails.address && (
                              <p className="text-[11px] text-[#6b4c91] truncate">{t.stayDetails.address}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Local Contacts (only if they exist in DB) */}
                      {Array.isArray(t.localContacts) && t.localContacts.length > 0 && (
                        <div className="bg-white/60 rounded-xl p-3 space-y-1.5">
                          {t.localContacts.map((c: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#2d6a4f]">
                              <Users className="w-3.5 h-3.5 shrink-0" />
                              <span className="font-semibold">{c.name}</span>
                              {c.role && <span className="text-[#5a4836]">({c.role})</span>}
                              {c.phone && (
                                <span className="ml-auto flex items-center gap-1 text-[11px]">
                                  <Phone className="w-3 h-3" /> {c.phone}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ═══════════ TASK CARDS (raw DB records) ═══════════ */}
            {tasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#5a4836] uppercase tracking-wider">
                  Tasks Due ({tasks.length})
                </h3>
                {tasks.map((task: any) => (
                  <div
                    key={task._id}
                    className="rounded-2xl border border-blue-200 bg-[#eef4ff] p-4 cursor-pointer hover:bg-[#e4edff] transition-colors group flex items-start gap-3"
                    onClick={() => { onOpenChange(false); router.push("/tasks"); }}
                  >
                    <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#1e3a8a] truncate">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#2563eb]">
                        {task.priority && (
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            task.priority === "HIGH" || task.priority === "URGENT"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "MEDIUM"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {task.priority}
                          </span>
                        )}
                        {task.assignedTo?.name && (
                          <span>• {task.assignedTo.name}</span>
                        )}
                        {task.status && (
                          <span>• {task.status}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* ═══════════ CUSTOM EVENTS (raw DB records) ═══════════ */}
            {customEvents.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#5a4836] uppercase tracking-wider">
                  Events ({customEvents.length})
                </h3>
                {customEvents.map((evt: any) => (
                  <div
                    key={evt._id}
                    className="rounded-2xl border border-amber-200 bg-[#fff6ea] p-4 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#8a4b16]">{evt.title}</h4>
                      {evt.location && (
                        <p className="text-[11px] text-[#ad6526] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {evt.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Floating Action Button ── */}
        <div className="sticky bottom-4 flex justify-end pointer-events-none mt-4">
          <button
            type="button"
            onClick={() => { onOpenChange(false); router.push("/travel/create"); }}
            className="w-12 h-12 rounded-full bg-[#174824] hover:bg-[#12381c] text-white shadow-xl flex items-center justify-center pointer-events-auto transition-transform active:scale-95 hover:scale-105 border-2 border-white cursor-pointer"
            title="Create Travel"
            aria-label="Add Travel"
          >
            <Plus className="w-6 h-6 text-amber-300 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </EResponsiveDrawer>
  );
}
