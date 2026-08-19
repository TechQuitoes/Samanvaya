"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plane,
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
  Filter,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import useTravel from "@/hooks/useTravel";
import { TravelStatus } from "@/types/travel";

function formatDateRange(startDateStr: string, endDateStr: string): string {
  const start = new Date(startDateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  const end = new Date(endDateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${start} - ${end}`;
}

function getTravelStatusBadge(status: TravelStatus) {
  switch (status) {
    case TravelStatus.UPCOMING:
      return (
        <Badge className="bg-amber-600 text-white font-bold text-xs px-2.5 py-0.5 gap-1">
          <Clock className="w-3.5 h-3.5" />
          UPCOMING
        </Badge>
      );
    case TravelStatus.ONGOING:
      return (
        <Badge className="bg-emerald-700 text-white font-bold text-xs px-2.5 py-0.5 gap-1">
          <Plane className="w-3.5 h-3.5 animate-pulse" />
          ONGOING
        </Badge>
      );
    case TravelStatus.COMPLETED:
      return (
        <Badge className="bg-blue-700 text-white font-bold text-xs px-2.5 py-0.5 gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          COMPLETED
        </Badge>
      );
    case TravelStatus.CANCELLED:
      return (
        <Badge className="bg-red-700 text-white font-bold text-xs px-2.5 py-0.5 gap-1">
          <XCircle className="w-3.5 h-3.5" />
          CANCELLED
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function TravelDashboardPage() {
  const router = useRouter();
  const { travels, isLoading } = useTravel();
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
  const cancelledList = filteredTravels.filter((t) => t.status === TravelStatus.CANCELLED);

  return (
    <SacredPortalLayout>
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs">
              <Plane className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#174824]">
                Travel Management System
              </h2>
              <p className="text-xs sm:text-sm text-[#5a4836] font-medium">
                Create travel records, manage stays, transport, tasks & expenses
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/travel/create")}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            Create New Travel Entry
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5a4836] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, event title, or purpose..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#e5d9c3] bg-[#faf4e8] text-xs font-semibold text-[#2c221e] focus:outline-none focus:ring-2 focus:ring-[#174824]"
          />
        </div>

        <Button
          onClick={() => router.push("/travel/create?backdated=true")}
          variant="outline"
          className="rounded-2xl border-[#cfa35d] text-[#174824] hover:bg-[#faf4e8] text-xs font-semibold gap-1.5 h-11 px-4 cursor-pointer"
        >
          <History className="w-4 h-4 text-amber-700" />
          <span>Log Backdated Travel</span>
        </Button>
      </div>

      {/* Main Status Tabs */}
      <Tabs defaultValue="all" className="w-full space-y-4">
        <TabsList className="bg-[#faf4e8] border border-[#e5d9c3] p-1.5 rounded-2xl w-full sm:w-auto justify-start h-auto flex flex-wrap gap-1 shadow-xs">
          <TabsTrigger
            value="all"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white text-[#5a4836] transition-all cursor-pointer"
          >
            <span>All Travels ({filteredTravels.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="ongoing"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white text-[#5a4836] transition-all cursor-pointer"
          >
            <span>Ongoing ({ongoingList.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="upcoming"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white text-[#5a4836] transition-all cursor-pointer"
          >
            <span>Upcoming ({upcomingList.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="completed"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#174824] data-[state=active]:text-white text-[#5a4836] transition-all cursor-pointer"
          >
            <span>Completed ({completedList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="all" className="mt-0">
          <TravelGridList
            travels={filteredTravels}
            isLoading={isLoading}
            onSelect={(id) => router.push(`/travel/${id}`)}
          />
        </TabsContent>

        <TabsContent value="ongoing" className="mt-0">
          <TravelGridList
            travels={ongoingList}
            isLoading={isLoading}
            onSelect={(id) => router.push(`/travel/${id}`)}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          <TravelGridList
            travels={upcomingList}
            isLoading={isLoading}
            onSelect={(id) => router.push(`/travel/${id}`)}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <TravelGridList
            travels={completedList}
            isLoading={isLoading}
            onSelect={(id) => router.push(`/travel/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </SacredPortalLayout>
  );
}

/* ─── Reusable Travel Cards Grid Component ─── */
interface TravelGridListProps {
  travels: any[];
  isLoading: boolean;
  onSelect: (id: string) => void;
}

function TravelGridList({ travels, isLoading, onSelect }: TravelGridListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-[24px] bg-[#e5d9c3]/60" />
        ))}
      </div>
    );
  }

  if (travels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="p-4 rounded-full bg-[#174824]/5 mb-3">
          <Plane className="w-12 h-12 text-[#174824]/40" />
        </div>
        <h3 className="text-lg font-bold text-[#174824] mb-1">
          No Travel Records Found
        </h3>
        <p className="text-xs sm:text-sm text-[#5a4836] max-w-sm font-medium">
          Create a new travel entry using the multi-step wizard or log backdated records.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {travels.map((t) => {
        const totalExpenses = t.expenses?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0;

        return (
          <Card
            key={t._id}
            onClick={() => onSelect(t._id)}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#e5d9c3] bg-[#faf4e8] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            {/* Header Status */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-[#174824] group-hover:text-emerald-800 transition-colors">
                    {t.title}
                  </h4>
                  {t.isBackdated && (
                    <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-900 bg-amber-50">
                      Backdated
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#5a4836] font-medium">{t.purpose}</p>
              </div>
              {getTravelStatusBadge(t.status)}
            </div>

            {/* Travel Route Info */}
            <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e5d9c3]/60 flex items-center justify-between text-xs font-semibold text-[#2c221e]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#174824]" />
                <span>{t.fromLocation}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700" />
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.destinationCity}</span>
              </div>
            </div>

            {/* Bottom Dates & Expense Footer */}
            <div className="flex items-center justify-between text-xs text-[#5a4836] font-semibold pt-1 border-t border-[#e5d9c3]/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#174824]" />
                <span>{formatDateRange(t.startDate, t.endDate)}</span>
              </div>

              {totalExpenses > 0 && (
                <div className="flex items-center gap-1 text-emerald-800 font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>₹{totalExpenses.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
