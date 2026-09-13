"use client";

import React from "react";
import {
  Plane,
  Train,
  Car,
  CarTaxiFront,
  Bus,
  Navigation,
  ArrowRight,
} from "lucide-react";
import ECard from "@/components/common/ECard";
import EButton from "@/components/common/EButton";
import ETextarea from "@/components/common/ETextarea";
import EInput from "@/components/common/EInput";
import EMobileInput from "@/components/common/EMobileInput";
import ESelect from "@/components/common/ESelect";
import EDateTimePicker from "@/components/common/EDateTimePicker";
import {
  CreateTravelPayload,
  TransportDetail,
  TransportMode,
} from "@/types/travel";
import {
  BUS_TYPE_OPTIONS,
  POPULAR_AIRLINES,
  SEAT_PREFERENCE_OPTIONS,
  TRAIN_QUOTA_OPTIONS,
  TRANSPORT_MODES,
} from "./constants";

interface Step2TransportProps {
  transport: TransportDetail;
  setTransport: React.Dispatch<React.SetStateAction<TransportDetail>>;
  formData: CreateTravelPayload;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Transport({
  transport,
  setTransport,
  formData,
  onNext,
  onPrev,
}: Step2TransportProps) {
  return (
    <ECard className="p-4 sm:p-6 space-y-4">
      <div className="border-b border-[#e5d9c3]/70 pb-2.5 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-[#174824] flex items-center gap-2">
          <Plane className="w-4 h-4 text-amber-700" />
          <span>Step 2: Transport Details</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
          Step 2 of 4
        </span>
      </div>

      {/* Select Mode of Transport Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#2c221e]">
          Select Mode of Transport <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {TRANSPORT_MODES.map((item) => {
            const Icon = item.icon;
            const isSelected = transport.mode === item.mode;

            return (
              <div
                key={item.mode}
                onClick={() => setTransport({ ...transport, mode: item.mode })}
                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 cursor-pointer select-none ${
                  isSelected
                    ? "border-[#174824] bg-[#174824]/10 shadow-xs scale-[1.02]"
                    : "border-[#e5d9c3] bg-[#faf5eb]/50 hover:bg-[#faf5eb]"
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? "bg-[#174824] text-white"
                      : "bg-[#fbf7f0] text-[#174824]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-[#2c221e] truncate w-full">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Mode-wise Exact Specification Fields */}
      <div className="p-4 rounded-xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-3.5">
        {/* ✈️ 1. FLIGHT */}
        {transport.mode === TransportMode.FLIGHT && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]">
              <Plane className="w-4 h-4 text-amber-700" />
              <span>Flight Booking Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ESelect
                label="Airline"
                value={transport.airline || "IndiGo"}
                onChange={(val) => setTransport({ ...transport, airline: val })}
                options={POPULAR_AIRLINES}
                placeholder="Select airline"
                searchable
                required
              />
              <EInput
                label="Flight Number"
                value={transport.flightNo || ""}
                onChange={(e) =>
                  setTransport({ ...transport, flightNo: e.target.value })
                }
                placeholder="e.g. 6E-204"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="PNR"
                value={transport.pnr || ""}
                onChange={(e) =>
                  setTransport({ ...transport, pnr: e.target.value })
                }
                placeholder="e.g. PNR-XY987Z (Optional)"
              />
              <ESelect
                label="Seat Preference"
                value={transport.seatPreference || "Aisle"}
                onChange={(val) =>
                  setTransport({ ...transport, seatPreference: val })
                }
                options={SEAT_PREFERENCE_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Departure Airport"
                value={transport.departureAirport || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    departureAirport: e.target.value,
                  })
                }
                placeholder="e.g. BOM - Mumbai"
                required
              />
              <EInput
                label="Arrival Airport"
                value={transport.arrivalAirport || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    arrivalAirport: e.target.value,
                  })
                }
                placeholder="e.g. DEL - New Delhi"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EDateTimePicker
                label="Departure Date & Time"
                value={transport.departureTime}
                minDate={formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, departureTime: val })
                }
                required
              />
              <EDateTimePicker
                label="Arrival Date & Time"
                value={transport.arrivalTime}
                minDate={transport.departureTime || formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, arrivalTime: val })
                }
                required
              />
            </div>
          </div>
        )}

        {/* 🚆 2. TRAIN */}
        {transport.mode === TransportMode.TRAIN && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]">
              <Train className="w-4 h-4 text-amber-700" />
              <span>Train Transit Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Train Name / Number"
                value={transport.trainNameNo || ""}
                onChange={(e) =>
                  setTransport({ ...transport, trainNameNo: e.target.value })
                }
                placeholder="e.g. 12951 Rajdhani Express"
                required
              />
              <EInput
                label="PNR / Ticket Number"
                value={transport.pnr || ""}
                onChange={(e) =>
                  setTransport({ ...transport, pnr: e.target.value })
                }
                placeholder="e.g. 245-1234567"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Coach & Seat Number"
                value={transport.coachSeat || ""}
                onChange={(e) =>
                  setTransport({ ...transport, coachSeat: e.target.value })
                }
                placeholder="e.g. B2 - 42"
              />
              <ESelect
                label="Quota"
                value={transport.quota || "General"}
                onChange={(val) => setTransport({ ...transport, quota: val })}
                options={TRAIN_QUOTA_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Departure Station"
                value={transport.departureStation || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    departureStation: e.target.value,
                  })
                }
                placeholder="e.g. Mumbai Central (MMCT)"
                required
              />
              <EInput
                label="Arrival Station"
                value={transport.arrivalStation || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    arrivalStation: e.target.value,
                  })
                }
                placeholder="e.g. Mathura Junction (MTJ)"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EDateTimePicker
                label="Departure Date & Time"
                value={transport.departureTime}
                minDate={formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, departureTime: val })
                }
                required
              />
              <EDateTimePicker
                label="Arrival Date & Time"
                value={transport.arrivalTime}
                minDate={transport.departureTime || formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, arrivalTime: val })
                }
                required
              />
            </div>
          </div>
        )}

        {/* 🚗 3. CAR (Self-driven / Rental) */}
        {transport.mode === TransportMode.CAR && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]">
              <Car className="w-4 h-4 text-amber-700" />
              <span>Car (Self-driven / Rental) Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Car Model / Type"
                value={transport.carModel || ""}
                onChange={(e) =>
                  setTransport({ ...transport, carModel: e.target.value })
                }
                placeholder="e.g. Toyota Innova (SUV)"
                required
              />
              <EInput
                label="Vehicle Number"
                value={transport.vehicleNo || ""}
                onChange={(e) =>
                  setTransport({ ...transport, vehicleNo: e.target.value })
                }
                placeholder="e.g. MH 02 AB 1234"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Rental Agency / Provider Name"
                value={transport.rentalAgency || ""}
                onChange={(e) =>
                  setTransport({ ...transport, rentalAgency: e.target.value })
                }
                placeholder="e.g. Zoomcar / Fleet"
              />
              <EInput
                label="Booking Reference / Confirmation ID"
                value={transport.bookingRef || ""}
                onChange={(e) =>
                  setTransport({ ...transport, bookingRef: e.target.value })
                }
                placeholder="e.g. BKG-CAR-909"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Pickup Location"
                value={transport.pickupLocation || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    pickupLocation: e.target.value,
                  })
                }
                placeholder="Pickup address / spot"
                required
              />
              <EDateTimePicker
                label="Pickup Date & Time"
                value={transport.departureTime}
                minDate={formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, departureTime: val })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Drop-off Location"
                value={transport.dropoffLocation || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    dropoffLocation: e.target.value,
                  })
                }
                placeholder="Drop-off address / spot"
                required
              />
              <EDateTimePicker
                label="Drop-off Date & Time"
                value={transport.arrivalTime}
                minDate={transport.departureTime || formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, arrivalTime: val })
                }
                required
              />
            </div>

            <ETextarea
              label="Toll / Fastag Notes"
              value={transport.tollNotes || ""}
              onChange={(e) =>
                setTransport({ ...transport, tollNotes: e.target.value })
              }
              rows={2}
              placeholder="Fastag balance, toll details or parking instructions..."
            />
          </div>
        )}

        {/* 🚙 4. PICKUP / CAB (Chauffeur Transit) */}
        {transport.mode === TransportMode.PICKUP && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]">
              <CarTaxiFront className="w-4 h-4 text-amber-700" />
              <span>Pickup / Cab (Chauffeur Transit)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Cab Provider / Service"
                value={transport.cabProvider || ""}
                onChange={(e) =>
                  setTransport({ ...transport, cabProvider: e.target.value })
                }
                placeholder="e.g. Temple Cab / Ola / Uber"
                required
              />
              <EInput
                label="Driver Name"
                value={transport.driverName || ""}
                onChange={(e) =>
                  setTransport({ ...transport, driverName: e.target.value })
                }
                placeholder="e.g. Ramesh Kumar"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EMobileInput
                label="Driver Contact Number"
                value={transport.driverPhone || ""}
                onChange={(e) =>
                  setTransport({ ...transport, driverPhone: e.target.value })
                }
                placeholder="+91 98765 43210"
                required
              />
              <EInput
                label="Vehicle Number"
                value={transport.vehicleNo || ""}
                onChange={(e) =>
                  setTransport({ ...transport, vehicleNo: e.target.value })
                }
                placeholder="e.g. UP 85 AX 9999"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Pickup Location"
                value={transport.pickupLocation || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    pickupLocation: e.target.value,
                  })
                }
                placeholder="e.g. Delhi Airport T3"
                required
              />
              <EInput
                label="Drop-off Location"
                value={transport.dropoffLocation || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    dropoffLocation: e.target.value,
                  })
                }
                placeholder="e.g. ISKCON Vrindavan Guest House"
                required
              />
            </div>

            <EDateTimePicker
              label="Pickup Date & Time"
              value={transport.departureTime}
              minDate={formData.startDate}
              onChange={(val) =>
                setTransport({ ...transport, departureTime: val })
              }
              required
            />

            <ETextarea
              label="Instructions / Notes"
              value={transport.instructions || ""}
              onChange={(e) =>
                setTransport({ ...transport, instructions: e.target.value })
              }
              rows={2}
              placeholder="Driver pickup placard name, terminal meeting point..."
            />
          </div>
        )}

        {/* 🚌 5. BUS */}
        {transport.mode === TransportMode.BUS && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]">
              <Bus className="w-4 h-4 text-amber-700" />
              <span>Bus Transit Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Bus Operator / Travels Name"
                value={transport.busOperator || ""}
                onChange={(e) =>
                  setTransport({ ...transport, busOperator: e.target.value })
                }
                placeholder="e.g. Zingbus / IntrCity"
                required
              />
              <ESelect
                label="Bus Type"
                value={transport.busType || "Volvo Multi-Axle AC Sleeper"}
                onChange={(val) => setTransport({ ...transport, busType: val })}
                options={BUS_TYPE_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Ticket / Booking Reference"
                value={transport.ticketRef || ""}
                onChange={(e) =>
                  setTransport({ ...transport, ticketRef: e.target.value })
                }
                placeholder="e.g. ZING-8821"
              />
              <EInput
                label="Seat Number"
                value={transport.seatNo || ""}
                onChange={(e) =>
                  setTransport({ ...transport, seatNo: e.target.value })
                }
                placeholder="e.g. 12 (Lower Berth)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Boarding Point"
                value={transport.boardingPoint || ""}
                onChange={(e) =>
                  setTransport({ ...transport, boardingPoint: e.target.value })
                }
                placeholder="Boarding stop / station"
                required
              />
              <EInput
                label="Drop Point"
                value={transport.dropPoint || ""}
                onChange={(e) =>
                  setTransport({ ...transport, dropPoint: e.target.value })
                }
                placeholder="Drop stop / station"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EDateTimePicker
                label="Departure Date & Time"
                value={transport.departureTime}
                minDate={formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, departureTime: val })
                }
                required
              />
              <EDateTimePicker
                label="Arrival Date & Time"
                value={transport.arrivalTime}
                minDate={transport.departureTime || formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, arrivalTime: val })
                }
                required
              />
            </div>
          </div>
        )}

        {/* ⚙️ 6. OTHER */}
        {transport.mode === TransportMode.OTHER && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174824] pb-1 border-b border-[#e5d9c3]">
              <Navigation className="w-4 h-4 text-amber-700" />
              <span>Custom / Other Transit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="Mode Description"
                value={transport.modeDescription || ""}
                onChange={(e) =>
                  setTransport({
                    ...transport,
                    modeDescription: e.target.value,
                  })
                }
                placeholder="e.g. Mayapur Ferry, E-Rickshaw"
                required
              />
              <EInput
                label="Provider / Service Name"
                value={transport.providerName || ""}
                onChange={(e) =>
                  setTransport({ ...transport, providerName: e.target.value })
                }
                placeholder="e.g. Local Ghat Seva"
              />
            </div>

            <EInput
              label="Reference / Ticket No"
              value={transport.referenceNo || ""}
              onChange={(e) =>
                setTransport({ ...transport, referenceNo: e.target.value })
              }
              placeholder="Ticket or receipt ref"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="From Location"
                value={transport.fromLocation || ""}
                onChange={(e) =>
                  setTransport({ ...transport, fromLocation: e.target.value })
                }
                placeholder="Departure spot"
                required
              />
              <EDateTimePicker
                label="Departure Date & Time"
                value={transport.departureTime}
                minDate={formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, departureTime: val })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EInput
                label="To Location"
                value={transport.toLocation || ""}
                onChange={(e) =>
                  setTransport({ ...transport, toLocation: e.target.value })
                }
                placeholder="Destination spot"
                required
              />
              <EDateTimePicker
                label="Arrival Date & Time"
                value={transport.arrivalTime}
                minDate={transport.departureTime || formData.startDate}
                onChange={(val) =>
                  setTransport({ ...transport, arrivalTime: val })
                }
                required
              />
            </div>

            <ETextarea
              label="Notes"
              value={transport.notes || ""}
              onChange={(e) =>
                setTransport({ ...transport, notes: e.target.value })
              }
              rows={2}
              placeholder="Additional instructions..."
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
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
          onClick={onNext}
          variant="sacred-primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Next: Stay & Contacts
        </EButton>
      </div>
    </ECard>
  );
}
