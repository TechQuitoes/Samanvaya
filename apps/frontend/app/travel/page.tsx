"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plane,
  Train,
  Car,
  Bus,
  CarTaxiFront,
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  ArrowRight,
  MoreVertical,
  CalendarDays,
  CheckSquare,
  FolderOpen,
  MoreHorizontal,
  Sparkles,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import useTravel from "@/hooks/useTravel";
import { TransportMode, Travel, TravelStatus } from "@/types/travel";

function formatDateRangeWithDays(startDateStr: string, endDateStr: string): string {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const startFormatted = start.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const endFormatted = end.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted} (${diffDays} Days)`;
}

function getTransportModeIcon(mode?: TransportMode) {
  switch (mode) {
    case TransportMode.TRAIN:
      return Train;
    case TransportMode.CAR:
      return Car;
    case TransportMode.BUS:
      return Bus;
    case TransportMode.PICKUP:
      return CarTaxiFront;
    case TransportMode.FLIGHT:
    default:
      return Plane;
  }
}

function getTravelStatusBadge(status: TravelStatus) {
  switch (status) {
    case TravelStatus.UPCOMING:
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[10px] sm:text-xs font-bold shadow-2xs">
          Upcoming
        </span>
      );
    case TravelStatus.ONGOING:
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-[10px] sm:text-xs font-bold shadow-2xs animate-pulse">
          Ongoing
        </span>
      );
    case TravelStatus.COMPLETED:
      return (
        <span className="px-2.5 py-1 rounded-full bg-blue-100/90 border border-blue-300 text-blue-900 text-[10px] sm:text-xs font-bold shadow-2xs">
          Completed
        </span>
      );
    case TravelStatus.CANCELLED:
      return (
        <span className="px-2.5 py-1 rounded-full bg-red-100/90 border border-red-300 text-red-900 text-[10px] sm:text-xs font-bold shadow-2xs">
          Cancelled
        </span>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function TravelDashboardPage() {
  const router = useRouter();
  const { travels, isLoading, deleteTravel } = useTravel();
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "completed">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTravels = travels.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.destinationCity.toLowerCase().includes(q) ||
      t.fromLocation.toLowerCase().includes(q) ||
      t.purpose.toLowerCase().includes(q)
    );
  });

  const upcomingList = filteredTravels.filter((t) => t.status === TravelStatus.UPCOMING);
  const ongoingList = filteredTravels.filter((t) => t.status === TravelStatus.ONGOING);
  const completedList = filteredTravels.filter((t) => t.status === TravelStatus.COMPLETED);

  const displayedList =
    activeTab === "upcoming"
      ? upcomingList
      : activeTab === "ongoing"
      ? ongoingList
      : completedList;

  return (
    <SacredPortalLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-8">
        {/* ─── 1. HERO ARTWORK BANNER (Exact design match) ─── */}
        <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[#e5d9c3] shadow-md bg-[#174824]">
          <div className="relative h-44 sm:h-56 w-full">
            <Image
              src="/assets/travel_bg_mobile002.png"
              alt="Radha Krishna Temple Artwork"
              fill
              priority
              className="object-cover object-top opacity-90"
            />
            {/* Soft dark green subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Devotional Floating Card */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-6 sm:right-6">
            <div className="bg-[#fffdfa]/95 backdrop-blur-md border border-[#e5d9c3] rounded-2xl p-3 sm:p-4 text-center shadow-lg">
              <p className="font-serif-display text-xs sm:text-sm italic font-bold text-[#174824] leading-relaxed">
                &ldquo;Travel to serve, Serve to inspire, Inspire to glorify.&rdquo;
              </p>
              <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] mt-0.5">
                &mdash; Srila Prabhupada
              </p>
            </div>
          </div>
        </div>

        {/* ─── 2. TRAVEL OVERVIEW TITLE & CTA BUTTON ─── */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#174824] tracking-tight">
            Travel Overview
          </h2>

          <Button
            onClick={() => router.push("/travel/create")}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md gap-1.5 cursor-pointer h-10"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Create New</span>
          </Button>
        </div>

        {/* ─── 3. FILTER TABS (Upcoming, Ongoing, Completed) ─── */}
        <div className="flex items-center gap-6 border-b border-[#e5d9c3] text-xs sm:text-sm font-bold pb-2 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 transition-all relative cursor-pointer ${
              activeTab === "upcoming"
                ? "text-[#174824]"
                : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Upcoming</span>
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ongoing")}
            className={`pb-2 transition-all relative cursor-pointer ${
              activeTab === "ongoing"
                ? "text-[#174824]"
                : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Ongoing</span>
            {activeTab === "ongoing" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`pb-2 transition-all relative cursor-pointer ${
              activeTab === "completed"
                ? "text-[#174824]"
                : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Completed</span>
            {activeTab === "completed" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>
        </div>

        {/* ─── 4. TRAVEL CARDS LIST ─── */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#faf4e8] border border-[#e5d9c3] flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl bg-[#e5d9c3]/60 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40 bg-[#e5d9c3]/60" />
                  <Skeleton className="h-3 w-60 bg-[#e5d9c3]/40" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedList.length === 0 ? (
          <Card className="rounded-[24px] p-8 text-center border border-[#e5d9c3] bg-[#fffdfa] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#174824]/10 text-[#174824] flex items-center justify-center mx-auto">
              <Plane className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#174824]">
              No {activeTab} travel plans found
            </p>
            <p className="text-xs text-[#5a4836] max-w-sm mx-auto">
              Create a new itinerary to organize visits, transports, and local devotee coordination.
            </p>
            <Button
              onClick={() => router.push("/travel/create")}
              className="bg-[#174824] text-white rounded-xl text-xs font-bold"
            >
              + Create First Travel Plan
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {displayedList.map((travel) => {
              const primaryTransport = travel.transportDetails?.[0];
              const TransportIcon = getTransportModeIcon(primaryTransport?.mode);

              return (
                <div
                  key={travel._id}
                  onClick={() => router.push(`/travel/${travel._id}`)}
                  className="p-4 sm:p-5 rounded-2xl sm:rounded-[24px] bg-[#fffdfa] border border-[#e5d9c3] hover:border-[#174824]/40 hover:shadow-md transition-all cursor-pointer select-none space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Mode Icon Badge + Title & Route */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#174824] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <TransportIcon className="w-5 h-5 text-amber-300" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#2c221e] group-hover:text-[#174824] transition-colors truncate">
                          {travel.title}
                        </h3>
                        <p className="text-xs text-[#5a4836] font-medium mt-0.5">
                          {formatDateRangeWithDays(travel.startDate, travel.endDate)}
                        </p>
                        <p className="text-xs font-semibold text-[#8c7865] flex items-center gap-1 mt-0.5">
                          <span>{travel.fromLocation}</span>
                          <span>&rarr;</span>
                          <span className="text-[#174824] font-bold">{travel.destinationCity}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Status Badge & 3-Dots Action */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getTravelStatusBadge(travel.status)}

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg hover:bg-black/5 text-[#5a4836] cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl bg-[#fffdfa] border-[#e5d9c3]">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/travel/${travel._id}`);
                            }}
                            className="text-xs font-medium cursor-pointer"
                          >
                            View Itinerary
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Are you sure you want to delete this travel plan?")) {
                                deleteTravel(travel._id);
                              }
                            }}
                            className="text-xs font-medium text-red-700 cursor-pointer"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Bottom: Coordinator Avatar Stack */}
                  <div className="flex items-center justify-between border-t border-[#e5d9c3]/50 pt-2.5">
                    <div className="flex items-center -space-x-2">
                      {travel.localContacts && travel.localContacts.length > 0 ? (
                        travel.localContacts.slice(0, 3).map((c, i) => (
                          <div
                            key={i}
                            title={`${c.name} (${c.role})`}
                            className="w-7 h-7 rounded-full bg-[#5a4836] border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                          >
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#174824]/20 border-2 border-white text-[#174824] text-[10px] font-bold flex items-center justify-center">
                          SV
                        </div>
                      )}
                      {travel.localContacts && travel.localContacts.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-[#e5d9c3] border-2 border-white text-[#5a4836] text-[10px] font-bold flex items-center justify-center">
                          +{travel.localContacts.length - 3}
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] text-[#8c7865] font-semibold flex items-center gap-1 group-hover:text-[#174824]">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── 5. SUMMARY STAT COUNTERS (Exact design match) ─── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-2">
          {/* Upcoming Stat */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] text-center shadow-2xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#174824]">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span className="text-base sm:text-xl font-bold">{upcomingList.length}</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] uppercase tracking-wider">
              Upcoming
            </p>
          </div>

          {/* Ongoing Stat */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] text-center shadow-2xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#174824]">
              <Plane className="w-4 h-4 text-emerald-700" />
              <span className="text-base sm:text-xl font-bold">{ongoingList.length}</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] uppercase tracking-wider">
              Ongoing
            </p>
          </div>

          {/* Completed Stat */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] text-center shadow-2xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#174824]">
              <CheckCircle2 className="w-4 h-4 text-blue-700" />
              <span className="text-base sm:text-xl font-bold">{completedList.length}</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] uppercase tracking-wider">
              Completed
            </p>
          </div>
        </div>

        {/* ─── 6. QUICK ACTIONS TRAY (Exact design match) ─── */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-[#5a4836] uppercase tracking-wider">
            Quick Actions
          </h3>

          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => router.push("/travel/create")}
              className="p-3 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] hover:border-[#174824] hover:bg-[#faf5eb] flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#174824]/10 text-[#174824] flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#2c221e] truncate w-full">New Travel</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/calendar")}
              className="p-3 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] hover:border-[#174824] hover:bg-[#faf5eb] flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#174824]/10 text-[#174824] flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#2c221e] truncate w-full">Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/tasks")}
              className="p-3 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] hover:border-[#174824] hover:bg-[#faf5eb] flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#174824]/10 text-[#174824] flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#2c221e] truncate w-full">Tasks</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/documentation")}
              className="p-3 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] hover:border-[#174824] hover:bg-[#faf5eb] flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#174824]/10 text-[#174824] flex items-center justify-center">
                <FolderOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#2c221e] truncate w-full">Documents</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="p-3 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] hover:border-[#174824] hover:bg-[#faf5eb] flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#174824]/10 text-[#174824] flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#2c221e] truncate w-full">More</span>
            </button>
          </div>
        </div>

        {/* ─── 7. SACRED FOOTER ARTWORK & QUOTE (Exact design match) ─── */}
        <footer className="pt-8 pb-4 text-center space-y-2 border-t border-[#e5d9c3]/50">
          <div className="relative w-10 h-10 mx-auto opacity-80">
            <Image
              src="/assets/04_lotus_icon_gold.png"
              alt="Lotus Flower"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs sm:text-sm font-serif-display italic text-[#174824] max-w-md mx-auto px-4 font-semibold">
            &ldquo;Every journey is an opportunity to serve and spread Krishna Consciousness.&rdquo;
          </p>
          <p className="text-[10px] text-[#8c7865] font-bold uppercase tracking-widest">
            Samanvaya &bull; Organise &bull; Coordinate &bull; Serve
          </p>
        </footer>
      </div>
    </SacredPortalLayout>
  );
}
