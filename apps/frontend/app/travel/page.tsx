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
  Navigation,
  Plus,
  Calendar,
  CheckCircle2,
  ArrowRight,
  MoreVertical,
  CalendarDays,
  CheckSquare,
  FolderOpen,
  MoreHorizontal,
  Search,
  Check,
  X,
  Clock,
  Eye,
  Trash2,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import TravelWizardForm from "@/components/travel/TravelWizardForm";
import TravelApprovalDrawer from "@/components/travel/TravelApprovalDrawer";
import useTravel from "@/hooks/useTravel";
import { TransportMode, Travel, TravelStatus } from "@/types/travel";

function formatDateRange(startDateStr: string, endDateStr: string): string {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const startFormatted = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const endFormatted = end.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startFormatted} – ${endFormatted}`;
}

function calculateDurationDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
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
    case TransportMode.OTHER:
      return Navigation;
    case TransportMode.FLIGHT:
    default:
      return Plane;
  }
}

export default function TravelDashboardPage() {
  const router = useRouter();
  const { travels, isLoading, deleteTravel, fetchTravels } = useTravel();
  const [activeTab, setActiveTab] = useState<"pending" | "upcoming" | "ongoing" | "completed" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedTravelForApproval, setSelectedTravelForApproval] = useState<Travel | null>(null);

  const filteredTravels = travels.filter((t) => {
    const q = searchQuery.toLowerCase();
    const leaderName = t.leaderId?.name?.toLowerCase() || "";
    return (
      t.title.toLowerCase().includes(q) ||
      t.destinationCity.toLowerCase().includes(q) ||
      t.fromLocation.toLowerCase().includes(q) ||
      t.purpose.toLowerCase().includes(q) ||
      leaderName.includes(q)
    );
  });

  const pendingList = filteredTravels.filter((t) => (t.approvalStatus || "PENDING") === "PENDING");
  const upcomingList = filteredTravels.filter((t) => t.status === TravelStatus.UPCOMING && t.approvalStatus !== "REJECTED");
  const ongoingList = filteredTravels.filter((t) => t.status === TravelStatus.ONGOING && t.approvalStatus !== "REJECTED");
  const completedList = filteredTravels.filter((t) => t.status === TravelStatus.COMPLETED);
  const rejectedList = filteredTravels.filter((t) => t.approvalStatus === "REJECTED" || t.status === TravelStatus.CANCELLED);

  const displayedList =
    activeTab === "pending"
      ? pendingList
      : activeTab === "upcoming"
      ? upcomingList
      : activeTab === "ongoing"
      ? ongoingList
      : activeTab === "completed"
      ? completedList
      : rejectedList;

  return (
    <SacredPortalLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-8">
        {/* ─── 1. HERO ARTWORK BANNER (Mobile Only) ─── */}
        <div className="relative -mx-6 -mt-4 pb-2 overflow-hidden w-[calc(100%+3rem)] md:hidden">
          <div className="relative h-48 sm:h-56 w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_55%,transparent_100%)]">
            <Image
              src="/images/travel/radha_rani_hero.jpg"
              alt="Radha Rani and Vedic Temple Artwork"
              fill
              priority
              className="object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f7f3e9]/50 via-transparent to-[#f7f3e9]" />
          </div>

          <div className="absolute bottom-1 left-6 right-6 z-10">
            <div className="bg-[#fffdfa]/95 backdrop-blur-md border border-[#e5d9c3] rounded-2xl p-2.5 text-center shadow-md max-w-md mx-auto relative">
              <p className="font-serif-display text-[11px] sm:text-xs italic font-bold text-[#174824] leading-tight">
                &ldquo;Travel to serve, Serve to inspire, Inspire to glorify.&rdquo;
              </p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-[#8c7865] mt-0.5">
                &mdash; Srila Prabhupada
              </p>
            </div>
          </div>
        </div>

        {/* ─── 2. TRAVEL OVERVIEW TITLE, SEARCH & CTA ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#174824] tracking-tight">
              Travel Management & Approvals
            </h2>
            <p className="text-xs text-[#5a4836] font-medium mt-0.5">
              Review, approve, and track devotional travel itineraries across temple centers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c7865] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event, city, devotee..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl bg-[#fffdfa] border border-[#e5d9c3] focus:border-[#174824] outline-none text-[#2c221e] placeholder:text-[#8c7865]/60 w-48 sm:w-60 transition-all shadow-2xs"
              />
            </div>

            <Button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-md gap-1.5 cursor-pointer h-9.5 flex-shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Create New</span>
            </Button>
          </div>
        </div>

        {/* ─── 3. FILTER TABS (Pending First, Upcoming, Ongoing, Completed, Rejected) ─── */}
        <div className="flex items-center gap-4 sm:gap-6 border-b border-[#e5d9c3] text-xs sm:text-sm font-bold pb-2 overflow-x-auto select-none no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`pb-2 transition-all relative cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "pending" ? "text-[#174824]" : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Pending Approval</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                pendingList.length > 0
                  ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                  : "bg-[#faf5eb] text-[#8c7865] border border-[#e5d9c3]"
              }`}
            >
              {pendingList.length}
            </span>
            {activeTab === "pending" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 transition-all relative cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "upcoming" ? "text-[#174824]" : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Upcoming</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#faf5eb] border border-[#e5d9c3]">
              {upcomingList.length}
            </span>
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ongoing")}
            className={`pb-2 transition-all relative cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "ongoing" ? "text-[#174824]" : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Ongoing</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#faf5eb] border border-[#e5d9c3]">
              {ongoingList.length}
            </span>
            {activeTab === "ongoing" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`pb-2 transition-all relative cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "completed" ? "text-[#174824]" : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Completed</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#faf5eb] border border-[#e5d9c3]">
              {completedList.length}
            </span>
            {activeTab === "completed" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rejected")}
            className={`pb-2 transition-all relative cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "rejected" ? "text-[#174824]" : "text-[#8c7865] hover:text-[#5a4836]"
            }`}
          >
            <span>Rejected</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#faf5eb] border border-[#e5d9c3]">
              {rejectedList.length}
            </span>
            {activeTab === "rejected" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#174824] rounded-full" />
            )}
          </button>
        </div>

        {/* ─── 4. SIMPLE TABLE LIST VIEW ─── */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#faf4e8] border border-[#e5d9c3] flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full bg-[#e5d9c3]/60 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48 bg-[#e5d9c3]/60" />
                  <Skeleton className="h-3 w-72 bg-[#e5d9c3]/40" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedList.length === 0 ? (
          <Card className="rounded-[24px] p-8 sm:p-12 text-center border border-[#e5d9c3] bg-[#fffdfa] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#174824]/10 text-[#174824] flex items-center justify-center mx-auto">
              <Plane className="w-6 h-6" />
            </div>
            <p className="text-sm sm:text-base font-bold text-[#174824] capitalize">
              No {activeTab} travel plans found
            </p>
            <p className="text-xs text-[#5a4836] max-w-sm mx-auto">
              Create a new itinerary or change the filter tab to view travel requests.
            </p>
            <Button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="bg-[#174824] text-white rounded-xl text-xs font-bold"
            >
              + Create Travel Plan
            </Button>
          </Card>
        ) : (
          <div className="bg-[#fffdfa] rounded-[24px] border border-[#e5d9c3] overflow-hidden shadow-xs">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e5d9c3] bg-[#faf5eb] text-[#8c7865] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Event & Creator</th>
                    <th className="py-3.5 px-3">Route</th>
                    <th className="py-3.5 px-3">Dates</th>
                    <th className="py-3.5 px-3">Transport</th>
                    <th className="py-3.5 px-3">Approval</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5d9c3]/60">
                  {displayedList.map((travel) => {
                    const primaryTransport = travel.transportDetails?.[0];
                    const TransportIcon = getTransportModeIcon(primaryTransport?.mode);
                    const approval = travel.approvalStatus || "PENDING";
                    const days = calculateDurationDays(travel.startDate, travel.endDate);

                    return (
                      <tr
                        key={travel._id}
                        onClick={() => setSelectedTravelForApproval(travel)}
                        className="hover:bg-[#fbf8f2] transition-colors cursor-pointer group"
                      >
                        {/* Event Title & Creator Devotee */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5 min-w-0 max-w-[220px]">
                            <div className="w-8 h-8 rounded-full bg-[#174824]/10 text-[#174824] flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {travel.leaderId?.name ? travel.leaderId.name.charAt(0).toUpperCase() : "D"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#2c221e] group-hover:text-[#174824] transition-colors truncate">
                                {travel.title}
                              </p>
                              <p className="text-[11px] text-[#8c7865] truncate font-medium">
                                By: {travel.leaderId?.name || "Devotee"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Route */}
                        <td className="py-3.5 px-3">
                          <div className="font-medium text-[#2c221e]">
                            <span className="font-semibold">{travel.fromLocation}</span>
                            <span className="text-[#8c7865] mx-1">&rarr;</span>
                            <span className="font-bold text-[#174824]">{travel.destinationCity}</span>
                          </div>
                          <p className="text-[10px] text-[#8c7865] truncate max-w-[140px]">
                            {travel.purpose}
                          </p>
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <p className="font-semibold text-[#2c221e]">
                            {formatDateRange(travel.startDate, travel.endDate)}
                          </p>
                          <span className="text-[10px] text-[#8c7865] font-medium bg-[#faf5eb] px-1.5 py-0.5 rounded border border-[#e5d9c3]">
                            {days} {days === 1 ? "Day" : "Days"}
                          </span>
                        </td>

                        {/* Transport */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg bg-[#faf5eb] text-amber-800 flex items-center justify-center flex-shrink-0">
                              <TransportIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 max-w-[140px]">
                              <p className="font-semibold text-[#2c221e] truncate">
                                {primaryTransport?.airline || primaryTransport?.trainNameNo || primaryTransport?.cabProvider || primaryTransport?.mode || "Transit"}
                              </p>
                              {primaryTransport?.pnr && (
                                <p className="text-[10px] font-mono text-[#8c7865]">
                                  PNR: {primaryTransport.pnr}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Approval Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${
                              approval === "APPROVED"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : approval === "REJECTED"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : "bg-amber-50 text-amber-900 border-amber-300"
                            }`}
                          >
                            {approval === "APPROVED" ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Approved</span>
                              </>
                            ) : approval === "REJECTED" ? (
                              <>
                                <X className="w-3 h-3 text-red-700" />
                                <span>Rejected</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Pending</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <Button
                              type="button"
                              onClick={() => setSelectedTravelForApproval(travel)}
                              size="sm"
                              variant={approval === "PENDING" ? "default" : "outline"}
                              className={`h-8 px-3 rounded-lg text-xs font-bold gap-1 cursor-pointer shadow-2xs ${
                                approval === "PENDING"
                                  ? "bg-[#174824] hover:bg-[#174824]/90 text-white"
                                  : approval === "APPROVED"
                                  ? "border-[#174824]/40 text-[#174824] hover:bg-[#faf5eb]"
                                  : "border-[#e5d9c3] text-[#8c7865] hover:bg-[#faf5eb]"
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{approval === "PENDING" ? "Review & Decide" : "View Details"}</span>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-black/5 text-[#5a4836] cursor-pointer">
                                <MoreVertical className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl bg-[#fffdfa] border-[#e5d9c3]">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/travel/${travel._id}`)}
                                  className="text-xs font-medium cursor-pointer"
                                >
                                  Full Travel View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setSelectedTravelForApproval(travel)}
                                  className="text-xs font-medium cursor-pointer"
                                >
                                  {approval === "PENDING" ? "Review & Decide" : "Manage Approval"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-[#e5d9c3]/60">
              {displayedList.map((travel) => {
                const primaryTransport = travel.transportDetails?.[0];
                const TransportIcon = getTransportModeIcon(primaryTransport?.mode);
                const approval = travel.approvalStatus || "PENDING";

                return (
                  <div
                    key={travel._id}
                    onClick={() => setSelectedTravelForApproval(travel)}
                    className="p-4 space-y-2.5 active:bg-[#faf5eb] transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#174824] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          <TransportIcon className="w-4 h-4 text-amber-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#2c221e] truncate">{travel.title}</p>
                          <p className="text-[11px] text-[#8c7865] font-medium">
                            By: {travel.leaderId?.name || "Devotee"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                          approval === "APPROVED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : approval === "REJECTED"
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-amber-50 text-amber-900 border-amber-300"
                        }`}
                      >
                        {approval}
                      </span>
                    </div>

                    <div className="text-xs text-[#5a4836] font-medium flex items-center justify-between border-t border-[#e5d9c3]/40 pt-2">
                      <p>
                        <span className="font-semibold">{travel.fromLocation}</span> &rarr;{" "}
                        <span className="font-bold text-[#174824]">{travel.destinationCity}</span>
                      </p>
                      <p className="text-[11px] text-[#8c7865]">
                        {formatDateRange(travel.startDate, travel.endDate)}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        onClick={() => setSelectedTravelForApproval(travel)}
                        size="sm"
                        variant={approval === "PENDING" ? "default" : "outline"}
                        className={`h-8 px-3 rounded-lg text-xs font-bold gap-1 ${
                          approval === "PENDING"
                            ? "bg-[#174824] text-white"
                            : approval === "APPROVED"
                            ? "border-[#174824]/40 text-[#174824]"
                            : "border-[#e5d9c3] text-[#8c7865]"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{approval === "PENDING" ? "Review & Decide" : "View Details"}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 5. SUMMARY STAT COUNTERS (3 Cards) ─── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-2">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] text-center shadow-2xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#174824]">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="text-base sm:text-xl font-bold">{pendingList.length}</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] uppercase tracking-wider">
              Pending
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] text-center shadow-2xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#174824]">
              <Plane className="w-4 h-4 text-emerald-700" />
              <span className="text-base sm:text-xl font-bold">{upcomingList.length}</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] uppercase tracking-wider">
              Upcoming
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] text-center shadow-2xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#174824]">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              <span className="text-base sm:text-xl font-bold">{completedList.length}</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8c7865] uppercase tracking-wider">
              Completed
            </p>
          </div>
        </div>

        {/* ─── 6. SACRED FOOTER ARTWORK & QUOTE ─── */}
        <footer className="relative mt-8 rounded-[28px] overflow-hidden border border-[#e5d9c3] shadow-md p-6 sm:p-8 text-center space-y-3 bg-[#faf5eb]">
          <div className="absolute inset-0 -z-0 opacity-40">
            <Image
              src="/images/travel/travel_footer.jpg"
              alt="Sacred Lotus Pond and Temple Artwork"
              fill
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f2]/95 via-[#fbf8f2]/70 to-[#fbf8f2]/85" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="relative w-7 h-7 mx-auto opacity-90">
              <Image
                src="/assets/04_lotus_icon_gold.png"
                alt="Lotus Flower"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm font-serif-display italic text-[#174824] max-w-md mx-auto px-4 font-bold leading-relaxed">
              &ldquo;Every journey is an opportunity to serve and spread Krishna Consciousness.&rdquo;
            </p>
            <p className="text-[10px] text-[#8c7865] font-bold uppercase tracking-widest pt-0.5">
              Samanvaya &bull; Organise &bull; Coordinate &bull; Serve
            </p>
          </div>
        </footer>
      </div>

      {/* ─── 7. CREATE TRAVEL DRAWER / BOTTOM SHEET ─── */}
      <EResponsiveDrawer
        open={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
        title="Create Travel Itinerary"
        description="4-Step devotional travel planning wizard"
        size="lg"
      >
        <TravelWizardForm
          onSuccess={() => {
            setIsCreateDrawerOpen(false);
            fetchTravels();
          }}
          onCancel={() => setIsCreateDrawerOpen(false)}
        />
      </EResponsiveDrawer>

      {/* ─── 8. REVIEW & APPROVAL DRAWER / BOTTOM SHEET ─── */}
      <TravelApprovalDrawer
        open={!!selectedTravelForApproval}
        onOpenChange={(open) => {
          if (!open) setSelectedTravelForApproval(null);
        }}
        travel={selectedTravelForApproval}
        onSuccess={() => {
          fetchTravels();
        }}
      />
    </SacredPortalLayout>
  );
}
