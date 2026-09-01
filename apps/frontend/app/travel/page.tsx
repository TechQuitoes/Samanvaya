"use client";

import { useState, useEffect } from "react";
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
import SacredPageHeader from "@/components/common/SacredPageHeader";
import { SacredStatCardsGroup, SacredStatCardItem } from "@/components/common/SacredStatCard";
import SacredPillTabs, { SacredPillTabItem } from "@/components/common/SacredPillTabs";
import SacredTableContainer from "@/components/common/SacredTableContainer";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import TravelWizardForm from "@/components/travel/TravelWizardForm";
import TravelApprovalDrawer from "@/components/travel/TravelApprovalDrawer";
import useTravel from "@/hooks/useTravel";
import { usePermissions } from "@/hooks/usePermissions";
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
  const { isSuperAdmin } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>(
    isSuperAdmin ? "pending" : "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedTravelForApproval, setSelectedTravelForApproval] = useState<Travel | null>(null);

  // Auto-switch to 'upcoming' for regular users once permissions load
  useEffect(() => {
    if (!isSuperAdmin) {
      setActiveTab("upcoming");
    }
  }, [isSuperAdmin]);

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

  // Standard Sacred Stat Cards
  const statCards: SacredStatCardItem[] = [
    {
      title: "Active & Upcoming",
      value: upcomingList.length + ongoingList.length,
      subtitle: "Scheduled Yatras",
      icon: Plane,
      variant: "emerald",
    },
    {
      title: "Pending Approval",
      value: pendingList.length,
      subtitle: "Needs Review",
      icon: Clock,
      variant: "amber",
      pulsingIcon: pendingList.length > 0,
    },
    {
      title: "Completed",
      value: completedList.length,
      subtitle: `${travels.length} Total Tours`,
      icon: CheckCircle2,
      variant: "default",
    },
  ];

  // Standard Sacred Pill Tabs
  const pillTabs: SacredPillTabItem[] = isSuperAdmin
    ? [
        {
          id: "pending",
          label: "Pending Approvals",
          count: pendingList.length,
          icon: Clock,
          countVariant: "amber",
        },
        {
          id: "upcoming",
          label: "Upcoming",
          count: upcomingList.length,
          icon: Calendar,
        },
        {
          id: "ongoing",
          label: "Ongoing",
          count: ongoingList.length,
          icon: Navigation,
        },
        {
          id: "completed",
          label: "Completed",
          count: completedList.length,
          icon: CheckCircle2,
        },
        {
          id: "rejected",
          label: "Rejected",
          count: rejectedList.length,
          icon: X,
          countVariant: "rose",
        },
      ]
    : [
        {
          id: "upcoming",
          label: "Upcoming",
          count: upcomingList.length,
          icon: Calendar,
        },
        {
          id: "ongoing",
          label: "Ongoing",
          count: ongoingList.length,
          icon: Navigation,
        },
        {
          id: "pending",
          label: "Submitted / Pending",
          count: pendingList.length,
          icon: Clock,
          countVariant: "amber",
        },
        {
          id: "completed",
          label: "Completed",
          count: completedList.length,
          icon: CheckCircle2,
        },
        {
          id: "rejected",
          label: "Rejected",
          count: rejectedList.length,
          icon: X,
          countVariant: "rose",
        },
      ];

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

        {/* ─── 2. SACRED PAGE HEADER (Title, Search & Action) ─── */}
        <SacredPageHeader
          title="Travel Management & Yatras"
          subtitle="Plan devotional itineraries, review approvals and coordinate seva duties"
          icon={Plane}
          actions={
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-[#8c7865] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by event, city, devotee..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl sm:rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] focus:border-[#174824] outline-none text-[#2c221e] placeholder:text-[#8c7865]/60 w-44 sm:w-60 transition-all shadow-2xs h-9 sm:h-10 font-medium"
                />
              </div>

              <Button
                onClick={() => setIsCreateDrawerOpen(true)}
                className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-sm gap-1.5 cursor-pointer h-9 sm:h-10 flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>Create New</span>
              </Button>
            </>
          }
        />

        {/* ─── 3. SACRED STAT CARDS BAR ─── */}
        <SacredStatCardsGroup cards={statCards} isLoading={isLoading} />

        {/* ─── 4. SACRED PILL FILTER TABS ─── */}
        <SacredPillTabs
          tabs={pillTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* ─── 5. SACRED TABLE & DATA CONTAINER ─── */}
        <SacredTableContainer
          isEmpty={!isLoading && displayedList.length === 0}
          emptyTitle={`No ${activeTab} travel plans found`}
          emptyDescription="Create a new itinerary or switch tabs to review other travel requests."
          emptyIcon={Plane}
          emptyAction={
            <Button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              + Create Travel Plan
            </Button>
          }
        >
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-[#e5d9c3]/60 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48 bg-[#e5d9c3]/60" />
                    <Skeleton className="h-3 w-72 bg-[#e5d9c3]/40" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl bg-[#e5d9c3]/60 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#e5d9c3] bg-[#faf4e8]/80 text-[#5a4836] font-bold text-xs uppercase tracking-wider">
                      <th className="py-3.5 pl-6 pr-3">Event & Creator</th>
                      <th className="py-3.5 px-3">Route</th>
                      <th className="py-3.5 px-3">Dates</th>
                      <th className="py-3.5 px-3">Transport</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5d9c3]/50">
                    {displayedList.map((travel) => {
                      const primaryTransport = travel.transportDetails?.[0];
                      const TransportIcon = getTransportModeIcon(primaryTransport?.mode);
                      const approval = travel.approvalStatus || "PENDING";
                      const days = calculateDurationDays(travel.startDate, travel.endDate);

                      return (
                        <tr
                          key={travel._id}
                          onClick={() => setSelectedTravelForApproval(travel)}
                          className="hover:bg-[#fcfaf5] transition-colors cursor-pointer group"
                        >
                          {/* Event Title & Creator Devotee */}
                          <td className="py-4 pl-6 pr-3">
                            <div className="flex items-center gap-3 min-w-0 max-w-[220px]">
                              <div className="w-10 h-10 rounded-full bg-[#174824]/10 border border-[#174824]/20 text-[#174824] flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
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
                          <td className="py-4 px-3">
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
                          <td className="py-4 px-3 whitespace-nowrap">
                            <p className="font-semibold text-[#2c221e]">
                              {formatDateRange(travel.startDate, travel.endDate)}
                            </p>
                            <span className="text-[10px] text-[#8c7865] font-medium bg-[#faf5eb] px-1.5 py-0.5 rounded border border-[#e5d9c3]">
                              {days} {days === 1 ? "Day" : "Days"}
                            </span>
                          </td>

                          {/* Transport */}
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-7 h-7 rounded-lg bg-[#174824]/10 text-[#174824] flex items-center justify-center flex-shrink-0">
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
                          <td className="py-4 px-3 whitespace-nowrap">
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
                          <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <Button
                                type="button"
                                onClick={() => setSelectedTravelForApproval(travel)}
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 rounded-xl border-[#e5d9c3] hover:border-[#174824] text-xs font-semibold text-[#174824] hover:bg-[#174824]/5 shadow-2xs gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#174824]" />
                                <span>{approval === "PENDING" && isSuperAdmin ? "Review & Decide" : "View Details"}</span>
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
              <div className="md:hidden divide-y divide-[#e5d9c3]/60 relative z-10">
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
                          <div className="w-9 h-9 rounded-full bg-[#174824] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 shadow-2xs">
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
                          variant="outline"
                          className="h-8 px-3 rounded-xl border-[#e5d9c3] hover:border-[#174824] text-xs font-semibold text-[#174824]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#174824]" />
                          <span>{approval === "PENDING" && isSuperAdmin ? "Review & Decide" : "View Details"}</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SacredTableContainer>

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
              LDMS &bull; Sacred Samanvaya Portal
            </p>
          </div>
        </footer>
      </div>

      {/* Create / Edit Travel Drawer */}
      <EResponsiveDrawer
        open={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
        title="Plan Devotional Travel / Tour"
        description="Fill out the travel itinerary, transport mode, and contact details."
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

      {/* Review / Approval Drawer */}
      <TravelApprovalDrawer
        open={!!selectedTravelForApproval}
        onOpenChange={(open) => {
          if (!open) setSelectedTravelForApproval(null);
        }}
        travel={selectedTravelForApproval}
        onSuccess={() => {
          setSelectedTravelForApproval(null);
          fetchTravels();
        }}
      />
    </SacredPortalLayout>
  );
}
