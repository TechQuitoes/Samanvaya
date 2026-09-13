"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  ExternalLink,
} from "lucide-react";
import ESkeleton from "@/components/common/ESkeleton";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { Travel } from "@/types/travel";

interface LinkedTravelCardProps {
  travelId?: string;
  fallbackTitle?: string;
  onNavigate?: () => void;
  compact?: boolean;
}

export default function LinkedTravelCard({
  travelId,
  fallbackTitle,
  onNavigate,
}: LinkedTravelCardProps) {
  const router = useRouter();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!travelId);

  useEffect(() => {
    if (!travelId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    apiNexus
      .call<Travel>("GET_TRAVEL_BY_ID", {
        params: { id: travelId },
      })
      .then((res) => {
        if (isMounted && res.isSuccess && res.data) {
          setTravel(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch linked travel details:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [travelId]);

  if (isLoading) {
    return (
      <div className="p-3 rounded-2xl bg-[#faf5eb] border border-[#e5d9c3] space-y-2">
        <ESkeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 gap-2">
          <ESkeleton className="h-4 w-full" />
          <ESkeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="p-3 rounded-2xl bg-[#faf5eb] border border-[#e5d9c3] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#174824]" />
          <span className="text-[#8c7865] font-medium">Linked Tour:</span>
          <span className="font-bold text-[#174824] truncate">
            {fallbackTitle || "Travel Assignment"}
          </span>
        </div>
      </div>
    );
  }

  // Calculate tour duration in days
  const start = new Date(travel.startDate);
  const end = new Date(travel.endDate);
  const durationDays = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  const primaryTransport = travel.transportDetails?.[0];

  const handleOpenItinerary = () => {
    onNavigate?.();
    router.push(`/travel/${travel._id}`);
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#faf5eb] border border-[#e5d9c3] space-y-2.5 text-xs text-[#2c221e] shadow-2xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e5d9c3]/60">
        <div className="flex items-center gap-2 min-w-0">
          <Plane className="w-4 h-4 text-[#174824] flex-shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-[#174824] truncate">
            {travel.title || `${travel.fromLocation} → ${travel.destinationCity}`}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
              travel.approvalStatus === "APPROVED"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : travel.approvalStatus === "REJECTED"
                ? "bg-red-50 text-red-800 border-red-300"
                : "bg-amber-50 text-amber-800 border-amber-300"
            }`}
          >
            {travel.approvalStatus || "PENDING"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenItinerary}
          className="text-[11px] font-bold text-[#174824] hover:text-[#174824]/80 flex items-center gap-1 flex-shrink-0 cursor-pointer hover:underline"
        >
          <span>Open Plan</span>
          <ExternalLink className="w-3 h-3 text-[#174824]" />
        </button>
      </div>

      {/* Clean Label & Value Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {/* Traveler / Leader */}
        <div className="flex items-baseline justify-between sm:justify-start gap-2">
          <span className="text-[11px] text-[#8c7865] font-medium flex-shrink-0 min-w-[70px]">
            Traveler:
          </span>
          <span className="font-bold text-[#2c221e] truncate">
            {travel.leaderId?.name || "Devotee"}
            {travel.leaderId?.mobile && (
              <span className="text-[11px] font-normal text-[#8c7865] ml-1">
                ({travel.leaderId.mobile})
              </span>
            )}
          </span>
        </div>

        {/* Schedule */}
        <div className="flex items-baseline justify-between sm:justify-start gap-2">
          <span className="text-[11px] text-[#8c7865] font-medium flex-shrink-0 min-w-[70px]">
            Schedule:
          </span>
          <span className="font-bold text-[#2c221e] truncate">
            {new Date(travel.startDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}{" "}
            –{" "}
            {new Date(travel.endDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}{" "}
            <span className="text-[10px] font-semibold text-[#174824] bg-emerald-50 px-1 py-0.5 rounded ml-0.5">
              {durationDays}d
            </span>
          </span>
        </div>

        {/* Route */}
        <div className="flex items-baseline justify-between sm:justify-start gap-2">
          <span className="text-[11px] text-[#8c7865] font-medium flex-shrink-0 min-w-[70px]">
            Route:
          </span>
          <span className="font-bold text-[#174824] truncate">
            {travel.fromLocation} → {travel.destinationCity}
          </span>
        </div>

        {/* Purpose */}
        {travel.purpose && (
          <div className="flex items-baseline justify-between sm:justify-start gap-2">
            <span className="text-[11px] text-[#8c7865] font-medium flex-shrink-0 min-w-[70px]">
              Purpose:
            </span>
            <span className="font-medium text-[#2c221e] truncate">
              {travel.purpose}
            </span>
          </div>
        )}

        {/* Transport (if present) */}
        {primaryTransport && (
          <div className="flex items-baseline justify-between sm:justify-start gap-2">
            <span className="text-[11px] text-[#8c7865] font-medium flex-shrink-0 min-w-[70px]">
              Transport:
            </span>
            <span className="font-semibold text-[#2c221e] truncate">
              {primaryTransport.airline ||
                primaryTransport.trainNameNo ||
                primaryTransport.cabProvider ||
                primaryTransport.carModel ||
                primaryTransport.mode}
              {primaryTransport.pnr && (
                <span className="text-[10px] text-[#8c7865] ml-1">
                  (PNR: {primaryTransport.pnr})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Accommodation (if present) */}
        {travel.stayDetails?.name && (
          <div className="flex items-baseline justify-between sm:justify-start gap-2">
            <span className="text-[11px] text-[#8c7865] font-medium flex-shrink-0 min-w-[70px]">
              Stay:
            </span>
            <span className="font-semibold text-[#2c221e] truncate">
              {travel.stayDetails.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
