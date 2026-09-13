"use client";

import React from "react";
import {
  Calendar,
  Plane,
  Train,
  Car,
  CarTaxiFront,
  Bus,
  Navigation,
  Building,
  User,
  FileText,
  Check,
  Edit3,
  Crown,
  Users,
  Paperclip,
} from "lucide-react";
import S3Uploader from "@/components/common/S3Uploader";
import ECard from "@/components/common/ECard";
import EButton from "@/components/common/EButton";
import ETextarea from "@/components/common/ETextarea";
import {
  CreateTravelPayload,
  TransportDetail,
  TransportMode,
  TravelCategory,
} from "@/types/travel";

interface Step5ReviewAndSubmitProps {
  formData: CreateTravelPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateTravelPayload>>;
  transport: TransportDetail;
  isSubmitting: boolean;
  onPrev: () => void;
  onSubmit: () => void;
  onJumpToStep: (step: number) => void;
}

export default function Step5ReviewAndSubmit({
  formData,
  setFormData,
  transport,
  isSubmitting,
  onPrev,
  onSubmit,
  onJumpToStep,
}: Step5ReviewAndSubmitProps) {
  return (
    <div className="space-y-4">
      {/* Main Review Card Container */}
      <ECard className="p-4 sm:p-6 space-y-0 divide-y divide-[#e5d9c3]/70">
        {/* Card Header */}
        <div className="pb-3.5 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#174824] font-serif-display">
            Review Your Travel Plan
          </h2>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="text-xs font-bold text-[#174824] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit All</span>
          </button>
        </div>

        {/* 1. Basic Details Row */}
        <div className="py-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-[#174824]" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                Basic Details
              </p>
              <p className="text-sm font-bold text-[#2c221e] truncate">
                {formData.title || "Untitled Travel Plan"}
              </p>
              <p className="text-xs text-[#5a4836] font-medium">
                {new Date(formData.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                &ndash;{" "}
                {new Date(formData.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-[11px] text-[#8c7865] font-medium">
                <span className="font-semibold text-[#174824]">
                  {formData.fromLocation}
                </span>{" "}
                &rarr;{" "}
                <span className="font-semibold text-[#174824]">
                  {formData.destinationCity}
                </span>{" "}
                &bull; {formData.purpose}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                  formData.category === TravelCategory.MAHARAJ_JI
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-[#174824]/10 text-[#174824] border-[#174824]/20"
                }`}
              >
                {formData.category === TravelCategory.MAHARAJ_JI ? (
                  <>
                    <Crown className="w-3 h-3 text-amber-700" />
                    <span>Maharaj Ji</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 text-[#174824]" />
                    <span>General</span>
                  </>
                )}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#174824]/10 text-[#174824] border border-[#174824]/20">
                {formData.status || "Upcoming"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="text-xs text-[#174824] hover:underline font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>

        {/* 2. Transport Row */}
        <div className="py-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              {transport.mode === TransportMode.FLIGHT && (
                <Plane className="w-4 h-4 text-amber-700" />
              )}
              {transport.mode === TransportMode.TRAIN && (
                <Train className="w-4 h-4 text-amber-700" />
              )}
              {transport.mode === TransportMode.CAR && (
                <Car className="w-4 h-4 text-amber-700" />
              )}
              {transport.mode === TransportMode.PICKUP && (
                <CarTaxiFront className="w-4 h-4 text-amber-700" />
              )}
              {transport.mode === TransportMode.BUS && (
                <Bus className="w-4 h-4 text-amber-700" />
              )}
              {transport.mode === TransportMode.OTHER && (
                <Navigation className="w-4 h-4 text-amber-700" />
              )}
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                Transport
              </p>
              <p className="text-sm font-bold text-[#2c221e]">
                {transport.mode} Transit
              </p>

              {/* Mode-specific detail snippet */}
              {transport.mode === TransportMode.FLIGHT && (
                <p className="text-xs text-[#5a4836] font-medium truncate">
                  {transport.airline} &ndash; {transport.flightNo}{" "}
                  {transport.seatPreference && `(${transport.seatPreference})`}
                </p>
              )}
              {transport.mode === TransportMode.TRAIN && (
                <p className="text-xs text-[#5a4836] font-medium truncate">
                  {transport.trainNameNo}{" "}
                  {transport.coachSeat && `• Coach/Seat: ${transport.coachSeat}`}
                </p>
              )}
              {transport.mode === TransportMode.CAR && (
                <p className="text-xs text-[#5a4836] font-medium truncate">
                  {transport.carModel}{" "}
                  {transport.vehicleNo && `(${transport.vehicleNo})`}
                </p>
              )}
              {transport.mode === TransportMode.PICKUP && (
                <p className="text-xs text-[#5a4836] font-medium truncate">
                  {transport.cabProvider} • Driver:{" "}
                  {transport.driverPhone || "Assigned"}
                </p>
              )}
              {transport.mode === TransportMode.BUS && (
                <p className="text-xs text-[#5a4836] font-medium truncate">
                  {transport.busOperator}{" "}
                  {transport.seatNo && `• Seat: ${transport.seatNo}`}
                </p>
              )}
              {transport.mode === TransportMode.OTHER && (
                <p className="text-xs text-[#5a4836] font-medium truncate">
                  {transport.modeDescription}
                </p>
              )}

              <p className="text-[11px] text-[#8c7865]">
                Departure:{" "}
                {new Date(
                  transport.departureTime || formData.startDate
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                &bull; Arrival:{" "}
                {new Date(
                  transport.arrivalTime || formData.endDate
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {transport.pnr && (
              <span className="text-xs font-mono font-bold text-[#174824] bg-[#faf5eb] px-2 py-0.5 rounded-md border border-[#e5d9c3]">
                PNR: {transport.pnr}
              </span>
            )}
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="text-xs text-[#174824] hover:underline font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>

        {/* 3. Stay Row */}
        <div className="py-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                Stay
              </p>
              <p className="text-sm font-bold text-[#2c221e] truncate">
                {formData.stayDetails?.name || "Temple Guest House"}
              </p>
              <p className="text-xs text-[#5a4836] truncate">
                {formData.stayDetails?.address || formData.destinationCity}
              </p>
              {formData.stayDetails?.checkIn && (
                <p className="text-[11px] text-[#8c7865]">
                  Check-in:{" "}
                  {new Date(formData.stayDetails.checkIn).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short" }
                  )}{" "}
                  &bull; Check-out:{" "}
                  {new Date(
                    formData.stayDetails.checkOut || formData.endDate
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {formData.stayDetails?.bookingRef && (
              <span className="text-[11px] font-mono text-[#5a4836] bg-[#faf5eb] px-1.5 py-0.5 rounded border border-[#e5d9c3]">
                Ref: {formData.stayDetails.bookingRef}
              </span>
            )}
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="text-xs text-[#174824] hover:underline font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>

        {/* 4. Contacts Row */}
        <div className="py-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                Contacts
              </p>
              <p className="text-sm font-bold text-[#2c221e]">
                {formData.localContacts?.length || 0} Contacts Added
              </p>
              {formData.localContacts && formData.localContacts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {formData.localContacts.map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#faf5eb] border border-[#e5d9c3] text-[#5a4836] px-2 py-0.5 rounded-md font-semibold"
                    >
                      {c.name} {c.role ? `(${c.role})` : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="text-xs text-[#174824] hover:underline font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>

        {/* 5. Attachments Row */}
        <div className="py-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Paperclip className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 space-y-1.5 flex-1">
              <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                Attachments ({formData.attachments?.length || 0})
              </p>
              <S3Uploader files={formData.attachments} viewOnly />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => onJumpToStep(4)}
              className="text-xs text-[#174824] hover:underline font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>

        {/* 6. Notes Row */}
        <div className="py-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 space-y-1.5 flex-1">
              <ETextarea
                label="Notes & Instructions"
                rows={2}
                value={formData.specialInstructions || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialInstructions: e.target.value,
                  })
                }
                placeholder="Add special instructions, prasadam arrangements, or coordination notes (optional)..."
              />
            </div>
          </div>
        </div>
      </ECard>

      {/* Bottom Action: Big Full-Width Save Button */}
      <div className="pt-2 flex items-center gap-3">
        <EButton
          type="button"
          onClick={onPrev}
          variant="outline"
          size="md"
        >
          Previous
        </EButton>
        <EButton
          type="button"
          isLoading={isSubmitting}
          loadingText="Saving Travel Plan..."
          onClick={onSubmit}
          variant="sacred-primary"
          size="md"
          leftIcon={<Check className="w-4 h-4" />}
          className="flex-1"
        >
          Save Travel Plan
        </EButton>
      </div>
    </div>
  );
}
