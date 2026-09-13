"use client";

import { useRouter } from "next/navigation";
import {
  Plane,
  Plus,
  MoreVertical,
  Search,
  Check,
  X,
  Clock,
  Eye,
  Crown,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { TravelCategory } from "@/types/travel";
import EButton from "@/components/common/EButton";
import EInput from "@/components/common/EInput";
import ESkeleton from "@/components/common/ESkeleton";
import EAvatar from "@/components/common/EAvatar";
import ESelect from "@/components/common/ESelect";
import ETable, {
  ETableHeader,
  ETableBody,
  ETableRow,
  ETableHead,
  ETableCell,
} from "@/components/common/ETable";
import { SacredStatCardsGroup } from "@/components/common/SacredStatCard";
import SacredPillTabs from "@/components/common/SacredPillTabs";
import SacredTableContainer from "@/components/common/SacredTableContainer";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import TravelWizardForm from "@/components/travel/TravelWizardForm";
import TravelApprovalDrawer from "@/components/travel/TravelApprovalDrawer";
import useTravelDashboard, {
  formatDateRange,
  calculateDurationDays,
  getTransportModeIcon,
} from "@/hooks/travel/useTravelDashboard";

export default function TravelDashboardPage() {
  const router = useRouter();
  const {
    travels,
    isLoading,
    isSuperAdmin,
    activeTab,
    setActiveTab,
    categorySort,
    toggleCategorySort,
    searchQuery,
    setSearchQuery,
    isCreateDrawerOpen,
    setIsCreateDrawerOpen,
    selectedTravelForApproval,
    setSelectedTravelForApproval,
    displayedList,
    statCards,
    pillTabs,
    handleDeleteTravel,
    fetchTravels,
  } = useTravelDashboard();

  return (
    <SacredPortalLayout
      showGreeting={false}
      title="Travel Management & Yatras"
      subtitle="Plan devotional itineraries, review approvals and coordinate seva duties"
      icon={Plane}
      heroArtwork={true}
      showFooterBanner={true}
      actions={
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <EInput
            inputSize="sm"
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event, city, devotee..."
            wrapperClassName="w-44 sm:w-60"
          />

          <EButton
            size="sm"
            onClick={() => setIsCreateDrawerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-amber-300" />}
          >
            Create New
          </EButton>
        </div>
      }
    >
      {/* ─── 1. SACRED STAT CARDS BAR ─── */}
      <SacredStatCardsGroup cards={statCards} isLoading={isLoading} />

      {/* ─── 2. SACRED FILTERS BAR: STATUS TABS ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <SacredPillTabs
          tabs={pillTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Mobile-only Sort Button */}
        <button
          type="button"
          onClick={toggleCategorySort}
          className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none flex-shrink-0 ${
            categorySort === "MAHARAJ_JI_FIRST"
              ? "bg-amber-100 text-amber-950 border-amber-300 shadow-2xs"
              : categorySort === "GENERAL_FIRST"
              ? "bg-[#174824]/10 text-[#174824] border-[#174824]/20 shadow-2xs"
              : "bg-[#faf4e8] text-[#5a4836] border-[#e5d9c3] hover:bg-white"
          }`}
          title="Sort by Category"
        >
          {categorySort === "MAHARAJ_JI_FIRST" ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Maharaj Ji First</span>
              <ArrowDown className="w-3 h-3 text-amber-700" />
            </>
          ) : categorySort === "GENERAL_FIRST" ? (
            <>
              <Users className="w-3.5 h-3.5 text-[#174824]" />
              <span>General First</span>
              <ArrowUp className="w-3 h-3 text-[#174824]" />
            </>
          ) : (
            <>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8c7865]" />
              <span>Sort Category</span>
            </>
          )}
        </button>
      </div>

      {/* ─── 3. SACRED TABLE & DATA CONTAINER ─── */}
      <SacredTableContainer
        isEmpty={!isLoading && displayedList.length === 0}
        emptyTitle={`No ${activeTab} travel plans found`}
        emptyDescription="Create a new itinerary or switch tabs to review other travel requests."
        emptyIcon={Plane}
        emptyAction={
          <EButton
            variant="primary"
            size="sm"
            onClick={() => setIsCreateDrawerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-amber-300" />}
          >
            Create Travel Plan
          </EButton>
        }
      >
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <ESkeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <ESkeleton className="h-4 w-48" />
                  <ESkeleton className="h-3 w-72" />
                </div>
                <ESkeleton className="h-8 w-20 rounded-xl flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <ETable>
                <ETableHeader>
                  <ETableRow>
                    <ETableHead className="pl-6">Devotee</ETableHead>
                    <ETableHead>
                      <button
                        type="button"
                        onClick={toggleCategorySort}
                        className="inline-flex items-center gap-1.5 font-bold hover:text-[#174824] transition-colors cursor-pointer select-none group/sort"
                        title={
                          categorySort === "MAHARAJ_JI_FIRST"
                            ? "Sorted: Maharaj Ji first (Click to sort General first)"
                            : categorySort === "GENERAL_FIRST"
                            ? "Sorted: General first (Click to reset default)"
                            : "Click to sort by Category"
                        }
                      >
                        <span>Category</span>
                        {categorySort === "MAHARAJ_JI_FIRST" ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            <Crown className="w-3 h-3 text-amber-600" />
                            <ArrowDown className="w-3 h-3 text-amber-700" />
                          </span>
                        ) : categorySort === "GENERAL_FIRST" ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#174824]/10 text-[#174824] border border-[#174824]/20 shadow-2xs">
                            <Users className="w-3 h-3 text-[#174824]" />
                            <ArrowUp className="w-3 h-3 text-[#174824]" />
                          </span>
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-[#8c7865] group-hover/sort:text-[#174824] transition-colors" />
                        )}
                      </button>
                    </ETableHead>
                    <ETableHead>Route</ETableHead>
                    <ETableHead>Dates</ETableHead>
                    <ETableHead>Transport</ETableHead>
                    <ETableHead>Status</ETableHead>
                    <ETableHead alignRight className="pr-6">Actions</ETableHead>
                  </ETableRow>
                </ETableHeader>
                <ETableBody>
                  {displayedList.map((travel) => {
                    const primaryTransport = travel.transportDetails?.[0];
                    const TransportIcon = getTransportModeIcon(primaryTransport?.mode);
                    const approval = travel.approvalStatus || "PENDING";
                    const days = calculateDurationDays(travel.startDate, travel.endDate);

                    return (
                      <ETableRow
                        key={travel._id}
                        clickable
                        onClick={() => setSelectedTravelForApproval(travel)}
                      >
                        {/* Devotee Full Name & Avatar */}
                        <ETableCell className="pl-6">
                          <div className="flex items-center gap-3 min-w-0 max-w-[220px]">
                            <EAvatar
                              src={travel.leaderId?.avatar}
                              name={travel.leaderId?.name || "Devotee"}
                              size="lg"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[#2c221e] group-hover:text-[#174824] transition-colors truncate text-sm">
                                {travel.leaderId?.name || "Devotee"}
                              </p>
                              {travel.title && (
                                <p className="text-[11px] text-[#8c7865] truncate font-medium">
                                  {travel.title}
                                </p>
                              )}
                            </div>
                          </div>
                        </ETableCell>

                        {/* Category */}
                        <ETableCell nowrap>
                          {travel.category === TravelCategory.MAHARAJ_JI ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-300 bg-amber-50 text-amber-900 inline-flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>Maharaj Ji</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#174824]/20 bg-[#174824]/5 text-[#174824] inline-flex items-center gap-1">
                              <Users className="w-3 h-3 text-[#174824]" />
                              <span>General</span>
                            </span>
                          )}
                        </ETableCell>

                        {/* Route */}
                        <ETableCell>
                          <div className="font-medium text-[#2c221e]">
                            <span className="font-semibold">{travel.fromLocation}</span>
                            <span className="text-[#8c7865] mx-1">&rarr;</span>
                            <span className="font-bold text-[#174824]">{travel.destinationCity}</span>
                          </div>
                          <p className="text-[10px] text-[#8c7865] truncate max-w-[140px]">
                            {travel.purpose}
                          </p>
                        </ETableCell>

                        {/* Dates */}
                        <ETableCell nowrap>
                          <p className="font-semibold text-[#2c221e]">
                            {formatDateRange(travel.startDate, travel.endDate)}
                          </p>
                          <span className="text-[10px] text-[#8c7865] font-medium bg-[#faf5eb] px-1.5 py-0.5 rounded border border-[#e5d9c3]">
                            {days} {days === 1 ? "Day" : "Days"}
                          </span>
                        </ETableCell>

                        {/* Transport */}
                        <ETableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-lg bg-[#174824]/10 text-[#174824] flex items-center justify-center flex-shrink-0">
                              <TransportIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 max-w-[140px]">
                              <p className="font-semibold text-[#2c221e] truncate">
                                {primaryTransport?.airline ||
                                  primaryTransport?.trainNameNo ||
                                  primaryTransport?.cabProvider ||
                                  primaryTransport?.mode ||
                                  "Transit"}
                              </p>
                              {primaryTransport?.pnr && (
                                <p className="text-[10px] font-mono text-[#8c7865]">
                                  PNR: {primaryTransport.pnr}
                                </p>
                              )}
                            </div>
                          </div>
                        </ETableCell>

                        {/* Approval Status */}
                        <ETableCell nowrap>
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
                        </ETableCell>

                        {/* Actions */}
                        <ETableCell alignRight nowrap className="pr-6">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EButton
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTravelForApproval(travel)}
                              leftIcon={<Eye className="w-3.5 h-3.5" />}
                            >
                              {approval === "PENDING" && isSuperAdmin
                                ? "Review"
                                : "View Details"}
                            </EButton>

                            <ESelect
                              trigger={<MoreVertical className="w-4 h-4" />}
                              align="end"
                              options={[
                                {
                                  label: "Full Travel View",
                                  value: "view",
                                  onClick: () => router.push(`/travel/${travel._id}`),
                                },
                                {
                                  label: approval === "PENDING" ? "Review" : "Manage Approval",
                                  value: "approval",
                                  onClick: () => setSelectedTravelForApproval(travel),
                                },
                                {
                                  label: "Delete",
                                  value: "delete",
                                  destructive: true,
                                  onClick: () => handleDeleteTravel(travel._id),
                                },
                              ]}
                            />
                          </div>
                        </ETableCell>
                      </ETableRow>
                    );
                  })}
                </ETableBody>
              </ETable>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-[#e5d9c3]/60 relative z-10">
              {displayedList.map((travel) => {
                const approval = travel.approvalStatus || "PENDING";

                return (
                  <div
                    key={travel._id}
                    onClick={() => setSelectedTravelForApproval(travel)}
                    className="p-4 space-y-2.5 active:bg-[#faf5eb] transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <EAvatar
                          src={travel.leaderId?.avatar}
                          name={travel.leaderId?.name || "Devotee"}
                          size="md"
                          className="mt-0.5"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#2c221e] truncate">
                            {travel.leaderId?.name || "Devotee"}
                          </p>
                          {travel.title && (
                            <p className="text-[11px] text-[#8c7865] font-medium truncate">
                              {travel.title}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {travel.category === TravelCategory.MAHARAJ_JI ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-300 bg-amber-50 text-amber-900 inline-flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5 text-amber-600" />
                            <span>Maharaj Ji</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#174824]/20 bg-[#174824]/5 text-[#174824] inline-flex items-center gap-1">
                            <Users className="w-2.5 h-2.5 text-[#174824]" />
                            <span>General</span>
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
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
                    </div>

                    <div className="text-xs text-[#5a4836] font-medium flex items-center justify-between border-t border-[#e5d9c3]/40 pt-2">
                      <p>
                        <span className="font-semibold">{travel.fromLocation}</span> &rarr;{" "}
                        <span className="font-bold text-[#174824]">
                          {travel.destinationCity}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#8c7865]">
                        {formatDateRange(travel.startDate, travel.endDate)}
                      </p>
                    </div>

                    <div
                      className="flex items-center justify-end gap-2 pt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EButton
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTravelForApproval(travel)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        {approval === "PENDING" && isSuperAdmin
                          ? "Review"
                          : "View Details"}
                      </EButton>

                      <ESelect
                        trigger={<MoreVertical className="w-4 h-4" />}
                        align="end"
                        options={[
                          {
                            label: "Full Travel View",
                            value: "view",
                            onClick: () => router.push(`/travel/${travel._id}`),
                          },
                          {
                            label: approval === "PENDING" ? "Review" : "Manage Approval",
                            value: "approval",
                            onClick: () => setSelectedTravelForApproval(travel),
                          },
                          {
                            label: "Delete",
                            value: "delete",
                            destructive: true,
                            onClick: () => handleDeleteTravel(travel._id),
                          },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </SacredTableContainer>

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
