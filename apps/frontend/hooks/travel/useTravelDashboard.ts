"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plane,
  Train,
  Car,
  Bus,
  CarTaxiFront,
  Navigation,
  Calendar,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import useTravel from "./useTravel";
import { usePermissions } from "@/hooks/usePermissions";
import { TransportMode, Travel, TravelCategory, TravelStatus } from "@/types/travel";
import { SacredStatCardItem } from "@/components/common/SacredStatCard";
import { SacredPillTabItem } from "@/components/common/SacredPillTabs";

export function formatDateRange(startDateStr: string, endDateStr: string): string {
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

export function calculateDurationDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

export function getTransportModeIcon(mode?: TransportMode) {
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

export type CategorySortOrder = "NONE" | "MAHARAJ_JI_FIRST" | "GENERAL_FIRST";

export function useTravelDashboard() {
  const { travels, isLoading, deleteTravel, fetchTravels } = useTravel();
  const { isSuperAdmin } = usePermissions();

  const [activeTab, setActiveTab] = useState<string>(
    isSuperAdmin ? "pending" : "upcoming"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [categorySort, setCategorySort] = useState<CategorySortOrder>("NONE");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedTravelForApproval, setSelectedTravelForApproval] =
    useState<Travel | null>(null);

  const toggleCategorySort = useCallback(() => {
    setCategorySort((prev) => {
      if (prev === "NONE") return "MAHARAJ_JI_FIRST";
      if (prev === "MAHARAJ_JI_FIRST") return "GENERAL_FIRST";
      return "NONE";
    });
  }, []);

  // Dynamic lifecycle status based on dates
  const getEffectiveStatus = useCallback((t: Travel): TravelStatus => {
    if (t.status === TravelStatus.CANCELLED || t.approvalStatus === "REJECTED") {
      return TravelStatus.CANCELLED;
    }
    const now = new Date();
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);

    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    if (now > endOfDay) {
      return TravelStatus.COMPLETED;
    }
    if (now >= start && now <= endOfDay) {
      return TravelStatus.ONGOING;
    }
    return TravelStatus.UPCOMING;
  }, []);

  // Filtered travels based on search query
  const filteredTravels = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return travels.filter((t) => {
      if (!q) return true;

      const leaderName = t.leaderId?.name?.toLowerCase() || "";
      return (
        t.title.toLowerCase().includes(q) ||
        t.destinationCity.toLowerCase().includes(q) ||
        t.fromLocation.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q) ||
        leaderName.includes(q)
      );
    });
  }, [travels, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    let generalCount = 0;
    let maharajJiCount = 0;
    for (const t of travels) {
      if (t.category === TravelCategory.MAHARAJ_JI) {
        maharajJiCount++;
      } else {
        generalCount++;
      }
    }
    return {
      all: travels.length,
      general: generalCount,
      maharajJi: maharajJiCount,
    };
  }, [travels]);

  // Tab categorization
  const pendingList = useMemo(
    () => filteredTravels.filter((t) => (t.approvalStatus || "PENDING") === "PENDING"),
    [filteredTravels]
  );

  const upcomingList = useMemo(
    () =>
      filteredTravels.filter(
        (t) =>
          getEffectiveStatus(t) === TravelStatus.UPCOMING &&
          t.approvalStatus !== "REJECTED" &&
          (t.approvalStatus || "PENDING") !== "PENDING"
      ),
    [filteredTravels, getEffectiveStatus]
  );

  const ongoingList = useMemo(
    () =>
      filteredTravels.filter(
        (t) =>
          getEffectiveStatus(t) === TravelStatus.ONGOING &&
          t.approvalStatus !== "REJECTED" &&
          (t.approvalStatus || "PENDING") !== "PENDING"
      ),
    [filteredTravels, getEffectiveStatus]
  );

  const completedList = useMemo(
    () =>
      filteredTravels.filter(
        (t) =>
          getEffectiveStatus(t) === TravelStatus.COMPLETED &&
          t.approvalStatus !== "REJECTED"
      ),
    [filteredTravels, getEffectiveStatus]
  );

  const rejectedList = useMemo(
    () =>
      filteredTravels.filter(
        (t) => t.approvalStatus === "REJECTED" || t.status === TravelStatus.CANCELLED
      ),
    [filteredTravels]
  );

  // Auto-switch tab if no pending items exist
  useEffect(() => {
    if (travels.length > 0) {
      if (pendingList.length === 0 && activeTab === "pending") {
        if (ongoingList.length > 0) {
          setActiveTab("ongoing");
        } else if (upcomingList.length > 0) {
          setActiveTab("upcoming");
        } else if (completedList.length > 0) {
          setActiveTab("completed");
        }
      } else if (!isSuperAdmin && activeTab === "pending") {
        setActiveTab(ongoingList.length > 0 ? "ongoing" : "upcoming");
      }
    }
  }, [travels.length, pendingList.length, ongoingList.length, upcomingList.length, completedList.length, isSuperAdmin, activeTab]);

  const rawDisplayedList = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return pendingList;
      case "upcoming":
        return upcomingList;
      case "ongoing":
        return ongoingList;
      case "completed":
        return completedList;
      case "rejected":
        return rejectedList;
      default:
        return pendingList;
    }
  }, [activeTab, pendingList, upcomingList, ongoingList, completedList, rejectedList]);

  const displayedList = useMemo(() => {
    if (categorySort === "NONE") return rawDisplayedList;
    return [...rawDisplayedList].sort((a, b) => {
      const aIsMaharaj = a.category === TravelCategory.MAHARAJ_JI ? 1 : 0;
      const bIsMaharaj = b.category === TravelCategory.MAHARAJ_JI ? 1 : 0;
      if (categorySort === "MAHARAJ_JI_FIRST") {
        return bIsMaharaj - aIsMaharaj;
      } else {
        return aIsMaharaj - bIsMaharaj;
      }
    });
  }, [rawDisplayedList, categorySort]);

  // Stat Cards configuration
  const statCards: SacredStatCardItem[] = useMemo(
    () => [
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
    ],
    [upcomingList.length, ongoingList.length, pendingList.length, completedList.length, travels.length]
  );

  // Pill Tabs configuration
  const pillTabs: SacredPillTabItem[] = useMemo(
    () =>
      isSuperAdmin
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
          ],
    [isSuperAdmin, pendingList.length, upcomingList.length, ongoingList.length, completedList.length, rejectedList.length]
  );

  const handleDeleteTravel = useCallback(
    (travelId: string) => {
      if (confirm("Are you sure you want to delete this travel plan?")) {
        deleteTravel(travelId);
      }
    },
    [deleteTravel]
  );

  return {
    travels,
    isLoading,
    isSuperAdmin,
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    categoryCounts,
    categorySort,
    setCategorySort,
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
  };
}

export default useTravelDashboard;
