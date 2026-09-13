"use client";

import React from "react";
import { MapPin, ArrowRight, Users, Crown } from "lucide-react";
import ECard from "@/components/common/ECard";
import EButton from "@/components/common/EButton";
import EInput from "@/components/common/EInput";
import ESelect from "@/components/common/ESelect";
import EDateTimePicker from "@/components/common/EDateTimePicker";
import { CreateTravelPayload, TravelCategory, TravelStatus } from "@/types/travel";
import {
  POPULAR_CITIES,
  PURPOSE_OPTIONS,
  STATUS_OPTIONS,
} from "./constants";

interface Step1BasicDetailsProps {
  formData: CreateTravelPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateTravelPayload>>;
  onNext: () => void;
}

export default function Step1BasicDetails({
  formData,
  setFormData,
  onNext,
}: Step1BasicDetailsProps) {
  return (
    <ECard className="p-4 sm:p-6 space-y-4">
      <div className="border-b border-[#e5d9c3]/70 pb-2.5 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-[#174824] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>Step 1: Basic Details</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
          Step 1 of 4
        </span>
      </div>

      {/* Travel Category Pill Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#2c221e] select-none">
          Travel Category <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#faf4e8] border border-[#e5d9c3] rounded-2xl">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, category: TravelCategory.GENERAL })
            }
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
              (formData.category || TravelCategory.GENERAL) ===
              TravelCategory.GENERAL
                ? "bg-[#174824] text-white shadow-sm ring-2 ring-[#174824]/20"
                : "bg-transparent text-[#5a4836] hover:bg-white/60 hover:text-[#174824]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>General</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, category: TravelCategory.MAHARAJ_JI })
            }
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
              formData.category === TravelCategory.MAHARAJ_JI
                ? "bg-amber-700 text-white shadow-sm ring-2 ring-amber-700/20"
                : "bg-transparent text-[#5a4836] hover:bg-white/60 hover:text-amber-800"
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Maharaj Ji</span>
          </button>
        </div>
        <p className="text-[11px] text-[#8c7865] font-medium pl-0.5">
          {(formData.category || TravelCategory.GENERAL) ===
          TravelCategory.MAHARAJ_JI
            ? "Special protocol yatra for His Holiness / Srila Prabhupada disciple"
            : "Standard devotional travel itinerary for devotees and seva team"}
        </p>
      </div>

      <EInput
        label="Event / Travel Name"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g. Vrindavan Visit"
        required
      />

      <ESelect
        label="Purpose of Travel"
        value={formData.purpose || "Preaching & Temple Seva Tour"}
        onChange={(val) => setFormData({ ...formData, purpose: val })}
        options={PURPOSE_OPTIONS}
        placeholder="Select purpose"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ESelect
          label="From"
          value={formData.fromLocation}
          onChange={(val) => setFormData({ ...formData, fromLocation: val })}
          options={POPULAR_CITIES}
          placeholder="Select city"
          searchable
          required
        />

        <ESelect
          label="To"
          value={formData.destinationCity}
          onChange={(val) => setFormData({ ...formData, destinationCity: val })}
          options={POPULAR_CITIES}
          placeholder="Select city"
          searchable
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <EDateTimePicker
          label="Start Date & Time"
          value={formData.startDate}
          onChange={(val) => {
            setFormData((prev) => {
              let updatedEnd = prev.endDate;
              if (val && updatedEnd && new Date(updatedEnd) < new Date(val)) {
                updatedEnd = val;
              }
              return { ...prev, startDate: val, endDate: updatedEnd };
            });
          }}
          placeholder="Select date & time"
          required
        />

        <EDateTimePicker
          label="End Date & Time"
          value={formData.endDate}
          minDate={formData.startDate}
          onChange={(val) => setFormData({ ...formData, endDate: val })}
          placeholder="Select date & time"
          error={
            formData.startDate &&
            formData.endDate &&
            new Date(formData.endDate) < new Date(formData.startDate)
              ? "End date cannot be earlier than start date"
              : undefined
          }
          required
        />
      </div>

      <ESelect
        label="Status"
        value={formData.status || TravelStatus.UPCOMING}
        onChange={(val) =>
          setFormData({ ...formData, status: val as TravelStatus })
        }
        options={STATUS_OPTIONS}
        placeholder="Select status"
      />

      <EButton
        type="button"
        onClick={onNext}
        variant="sacred-primary"
        size="md"
        className="w-full mt-1"
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Next: Transport Details
      </EButton>
    </ECard>
  );
}
