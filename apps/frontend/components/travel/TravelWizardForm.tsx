"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Plane,
  Train,
  Car,
  Bus,
  CarTaxiFront,
  Navigation,
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
  Building,
  User,
  CheckSquare,
  FileText,
  Check,
  Edit3,
  Ticket,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EInput from "@/components/common/EInput";
import ESelect from "@/components/common/ESelect";
import EDateTimePicker from "@/components/common/EDateTimePicker";
import S3Uploader from "@/components/common/S3Uploader";
import useTravel from "@/hooks/useTravel";
import {
  AccommodationType,
  CreateTravelPayload,
  CreateTravelTaskInput,
  ItineraryItem,
  LocalContact,
  TaskPriority,
  TaskStatus,
  TransportDetail,
  TransportMode,
  TravelAttachment,
  TravelStatus,
} from "@/types/travel";

const POPULAR_CITIES = [
  "Vrindavan",
  "Mayapur",
  "Mumbai",
  "Delhi",
  "Puri",
  "Bangalore",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Tirupati",
  "Udupi",
  "Dwarka",
  "Ayodhya",
  "Varanasi",
  "Kurukshetra",
  "Haridwar",
  "Rishikesh",
];

const PURPOSE_OPTIONS = [
  "Official Visit",
  "Pilgrimage / Yatra",
  "Preaching & Temple Seva Tour",
  "Festival / Rath Yatra",
  "Temple Inauguration / Opening",
  "Diksha Ceremony",
  "Youth / Community Camp",
  "Personal / Retreat",
];

const STAY_TYPE_OPTIONS = [
  { value: AccommodationType.TEMPLE, label: "ISKCON Guest House / Temple" },
  { value: AccommodationType.HOTEL, label: "Hotel" },
  { value: AccommodationType.ASHRAM, label: "Ashram" },
  { value: AccommodationType.DHARAMSHALA, label: "Dharamshala" },
  { value: AccommodationType.OTHER, label: "Devotee Residence / Other" },
];

const STATUS_OPTIONS = [
  { value: TravelStatus.UPCOMING, label: "Upcoming" },
  { value: TravelStatus.ONGOING, label: "Ongoing" },
  { value: TravelStatus.COMPLETED, label: "Completed" },
];

const SEAT_PREFERENCE_OPTIONS = [
  { value: "Window", label: "Window" },
  { value: "Aisle", label: "Aisle" },
  { value: "Middle", label: "Middle" },
  { value: "Extra Legroom", label: "Extra Legroom" },
];

const TRAIN_QUOTA_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Tatkal", label: "Tatkal" },
  { value: "Senior Citizen", label: "Senior Citizen" },
  { value: "Ladies", label: "Ladies" },
];

const BUS_TYPE_OPTIONS = [
  { value: "Volvo Multi-Axle AC Sleeper", label: "Volvo Multi-Axle AC Sleeper" },
  { value: "AC Seater", label: "AC Seater" },
  { value: "Non-AC Sleeper", label: "Non-AC Sleeper" },
];

const DOC_CATEGORY_OPTIONS = [
  { value: "Ticket", label: "Flight / Train Ticket" },
  { value: "Hotel Booking", label: "Hotel / Guest House PDF" },
  { value: "ID Proof", label: "Aadhar / Passport / ID" },
  { value: "Invitation", label: "Invitation Letter" },
  { value: "Invoice", label: "Travel Invoice / Bill" },
];

const POPULAR_AIRLINES = [
  "IndiGo",
  "Air India",
  "Vistara",
  "Akasa Air",
  "SpiceJet",
  "AIX Connect (AirAsia India)",
  "Alliance Air",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
  "Etihad Airways",
  "Lufthansa",
  "British Airways",
  "Other / Chartered",
];

const TASK_PRIORITY_OPTIONS = [
  { value: TaskPriority.HIGH, label: "High" },
  { value: TaskPriority.MEDIUM, label: "Medium" },
  { value: TaskPriority.LOW, label: "Low" },
];

const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, label: "Not Started" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
];

const DEVOTEE_ASSIGNEES = [
  { value: "Madhav Das", label: "Madhav Das (Coordinator)" },
  { value: "Govinda Das", label: "Govinda Das (Guest House Seva)" },
  { value: "Praveen Sharma", label: "Praveen Sharma (Travel Incharge)" },
  { value: "Shubham Verma", label: "Shubham Verma (Logistics)" },
  { value: "Darshan Kumar", label: "Darshan Kumar (Accounts)" },
];

const TRANSPORT_MODES = [
  { mode: TransportMode.FLIGHT, label: "Flight", icon: Plane, desc: "Airlines & Air transit" },
  { mode: TransportMode.TRAIN, label: "Train", icon: Train, desc: "Railways & Express" },
  { mode: TransportMode.CAR, label: "Car", icon: Car, desc: "Self-driven or Rental" },
  { mode: TransportMode.PICKUP, label: "Pickup / Cab", icon: CarTaxiFront, desc: "Chauffeur & Local transit" },
  { mode: TransportMode.BUS, label: "Bus", icon: Bus, desc: "Intercity coach or Sleeper" },
  { mode: TransportMode.OTHER, label: "Other", icon: Navigation, desc: "Ferry, Rickshaw, Custom" },
];

interface TravelWizardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TravelWizardForm({ onSuccess, onCancel }: TravelWizardFormProps) {
  const { createTravel, isSubmitting } = useTravel();
  const [currentStep, setCurrentStep] = useState(1);
  const formTopRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top of form/drawer whenever step changes
  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const scrollContainer = formTopRef.current?.closest(".overflow-y-auto");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Single Transport State
  const [transport, setTransport] = useState<TransportDetail>({
    mode: TransportMode.FLIGHT,
    airline: "IndiGo",
    flightNo: "",
    pnr: "",
    seatPreference: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: new Date().toISOString().slice(0, 16),
    arrivalTime: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
  });

  // Main Travel Form State
  const [formData, setFormData] = useState<CreateTravelPayload>({
    title: "",
    purpose: "Preaching & Temple Seva Tour",
    fromLocation: "",
    destinationCity: "",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    status: TravelStatus.UPCOMING,
    isBackdated: false,
    stayDetails: {
      type: AccommodationType.TEMPLE,
      name: "",
      address: "",
      checkIn: new Date().toISOString().slice(0, 16),
      checkOut: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
      bookingRef: "",
      contactPersonName: "",
      contactPersonPhone: "",
    },
    localContacts: [],
    specialInstructions: "",
    generalNotes: "",
  });

  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);

  // Step Validation & Navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        alert("Please enter an Event / Travel Name.");
        return;
      }
      if (!formData.fromLocation.trim() || !formData.destinationCity.trim()) {
        alert("Please specify From and To locations.");
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        alert("Please specify both Start Date and End Date.");
        return;
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        alert("End Date & Time cannot be earlier than Start Date & Time.");
        return;
      }
    }

    if (currentStep === 2) {
      if (transport.mode === TransportMode.FLIGHT) {
        if (!transport.airline || !transport.flightNo) {
          alert("Please enter Airline and Flight Number.");
          return;
        }
      } else if (transport.mode === TransportMode.TRAIN) {
        if (!transport.trainNameNo) {
          alert("Please enter Train Name / Number.");
          return;
        }
      } else if (transport.mode === TransportMode.PICKUP) {
        if (!transport.cabProvider || !transport.driverPhone) {
          alert("Please enter Cab Provider and Driver Contact Number.");
          return;
        }
      }
    }

    if (currentStep === 3) {
      if (!formData.stayDetails?.name?.trim()) {
        alert("Please enter Accommodation Name.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    // 1. Sanitize transport details
    const cleanTransport: TransportDetail = {
      mode: transport.mode,
      ...(transport.airline?.trim() && { airline: transport.airline.trim() }),
      ...(transport.flightNo?.trim() && { flightNo: transport.flightNo.trim() }),
      ...(transport.pnr?.trim() && { pnr: transport.pnr.trim() }),
      ...(transport.seatPreference?.trim() && { seatPreference: transport.seatPreference.trim() }),
      ...(transport.departureAirport?.trim() && { departureAirport: transport.departureAirport.trim() }),
      ...(transport.arrivalAirport?.trim() && { arrivalAirport: transport.arrivalAirport.trim() }),
      ...(transport.departureTime && { departureTime: new Date(transport.departureTime).toISOString() }),
      ...(transport.arrivalTime && { arrivalTime: new Date(transport.arrivalTime).toISOString() }),
      ...(transport.terminalGateClass?.trim() && { terminalGateClass: transport.terminalGateClass.trim() }),
      ...(transport.trainNameNo?.trim() && { trainNameNo: transport.trainNameNo.trim() }),
      ...(transport.coachSeat?.trim() && { coachSeat: transport.coachSeat.trim() }),
      ...(transport.departureStation?.trim() && { departureStation: transport.departureStation.trim() }),
      ...(transport.arrivalStation?.trim() && { arrivalStation: transport.arrivalStation.trim() }),
      ...(transport.quota?.trim() && { quota: transport.quota.trim() }),
      ...(transport.carModel?.trim() && { carModel: transport.carModel.trim() }),
      ...(transport.vehicleNo?.trim() && { vehicleNo: transport.vehicleNo.trim() }),
      ...(transport.rentalAgency?.trim() && { rentalAgency: transport.rentalAgency.trim() }),
      ...(transport.pickupLocation?.trim() && { pickupLocation: transport.pickupLocation.trim() }),
      ...(transport.dropoffLocation?.trim() && { dropoffLocation: transport.dropoffLocation.trim() }),
      ...(transport.tollNotes?.trim() && { tollNotes: transport.tollNotes.trim() }),
      ...(transport.cabProvider?.trim() && { cabProvider: transport.cabProvider.trim() }),
      ...(transport.driverName?.trim() && { driverName: transport.driverName.trim() }),
      ...(transport.driverPhone?.trim() && { driverPhone: transport.driverPhone.trim() }),
      ...(transport.instructions?.trim() && { instructions: transport.instructions.trim() }),
      ...(transport.busOperator?.trim() && { busOperator: transport.busOperator.trim() }),
      ...(transport.busType?.trim() && { busType: transport.busType.trim() }),
      ...(transport.ticketRef?.trim() && { ticketRef: transport.ticketRef.trim() }),
      ...(transport.seatNo?.trim() && { seatNo: transport.seatNo.trim() }),
      ...(transport.boardingPoint?.trim() && { boardingPoint: transport.boardingPoint.trim() }),
      ...(transport.dropPoint?.trim() && { dropPoint: transport.dropPoint.trim() }),
      ...(transport.modeDescription?.trim() && { modeDescription: transport.modeDescription.trim() }),
      ...(transport.providerName?.trim() && { providerName: transport.providerName.trim() }),
      ...(transport.referenceNo?.trim() && { referenceNo: transport.referenceNo.trim() }),
      ...(transport.notes?.trim() && { notes: transport.notes.trim() }),
    };

    // 2. Sanitize stay details
    const cleanStay = formData.stayDetails ? {
      ...(formData.stayDetails.type && { type: formData.stayDetails.type }),
      name: formData.stayDetails.name?.trim() || "Temple Guest House",
      ...(formData.stayDetails.address?.trim() && { address: formData.stayDetails.address.trim() }),
      ...(formData.stayDetails.bookingRef?.trim() && { bookingRef: formData.stayDetails.bookingRef.trim() }),
      ...(formData.stayDetails.checkIn && { checkIn: new Date(formData.stayDetails.checkIn).toISOString() }),
      ...(formData.stayDetails.checkOut && { checkOut: new Date(formData.stayDetails.checkOut).toISOString() }),
      ...(formData.stayDetails.contactPersonName?.trim() && { contactPersonName: formData.stayDetails.contactPersonName.trim() }),
      ...(formData.stayDetails.contactPersonPhone?.trim() && { contactPersonPhone: formData.stayDetails.contactPersonPhone.trim() }),
    } : undefined;

    // 3. Sanitize local contacts
    const cleanContacts = formData.localContacts
      ?.filter((c) => c.name?.trim())
      .map((c) => ({
        role: c.role?.trim() || "Coordinator",
        name: c.name.trim(),
        phone: c.phone.trim(),
        ...(c.email?.trim() && { email: c.email.trim() }),
      }));

    // 4. Construct payload strictly conforming to backend CreateTravelDto
    const payload: CreateTravelPayload = {
      title: formData.title.trim(),
      ...(formData.purpose?.trim() && { purpose: formData.purpose.trim() }),
      fromLocation: formData.fromLocation.trim(),
      destinationCity: formData.destinationCity.trim(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      status: (() => {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const now = new Date();
        if (end < now) return TravelStatus.COMPLETED;
        if (start <= now && end >= now) return TravelStatus.ONGOING;
        return TravelStatus.UPCOMING;
      })(),
      isBackdated: formData.isBackdated || false,
      transportDetails: [cleanTransport],
      ...(cleanStay && { stayDetails: cleanStay }),
      ...(cleanContacts && cleanContacts.length > 0 && { localContacts: cleanContacts }),
      ...(formData.specialInstructions?.trim() && { specialInstructions: formData.specialInstructions.trim() }),
      ...(formData.generalNotes?.trim() && { generalNotes: formData.generalNotes.trim() }),
    };

    const result = await createTravel(payload);
    if (result) {
      onSuccess?.();
    }
  };

  // Dynamic Local Contacts Handlers
  const addContactPerson = () => {
    const newContact: LocalContact = {
      role: "Local Coordinator",
      name: "",
      phone: "+91 ",
      email: "",
    };
    setFormData((prev) => ({
      ...prev,
      localContacts: [...(prev.localContacts || []), newContact],
    }));
  };

  const removeContactPerson = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      localContacts: prev.localContacts?.filter((_, i) => i !== index),
    }));
  };

  const updateContactPerson = (index: number, fields: Partial<LocalContact>) => {
    const updated = [...(formData.localContacts || [])];
    updated[index] = { ...updated[index], ...fields };
    setFormData({ ...formData, localContacts: updated });
  };

  const stepsList = [
    { num: 1, label: "Basic", title: "Basic Details" },
    { num: 2, label: "Transport", title: "Transport Details" },
    { num: 3, label: "Stay & Contacts", title: "Stay & Contacts" },
    { num: 4, label: "Review", title: "Review & Notes" },
  ];

  return (
    <div ref={formTopRef} className="space-y-5">
      {/* ─── 4-STEP NUMBERED STEPPER ─── */}
      <div className="bg-[#fbf8f2] border border-[#e5d9c3] rounded-2xl p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-4 h-[2px] bg-[#e5d9c3] -z-0" />

          {stepsList.map((step) => {
            const isActive = step.num === currentStep;
            const isCompleted = step.num < currentStep;

            return (
              <div
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep || (currentStep === 1 && formData.title.trim())) {
                    setCurrentStep(step.num);
                  }
                }}
                className="flex flex-col items-center gap-1.5 z-10 cursor-pointer select-none"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${isActive
                      ? "bg-[#174824] text-white ring-4 ring-[#174824]/20 scale-110"
                      : isCompleted
                        ? "bg-[#174824] text-white"
                        : "bg-[#fbf7f0] border border-[#cfa35d] text-[#5a4836]"
                    }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span
                  className={`text-[9px] sm:text-[11px] font-bold tracking-tight text-center ${isActive
                      ? "text-[#174824]"
                      : isCompleted
                        ? "text-[#5a4836]"
                        : "text-[#8c7865]"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STEP 1: BASIC DETAILS
         ══════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <Card className="rounded-2xl p-4 sm:p-6 border border-[#e5d9c3] bg-[#fffdfa] shadow-xs space-y-4">
          <div className="border-b border-[#e5d9c3]/70 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#174824] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>Step 1: Basic Details</span>
            </h2>
            <Badge className="bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
              Step 1 of 4
            </Badge>
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
                formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)
                  ? "End date cannot be earlier than start date"
                  : undefined
              }
              required
            />
          </div>

          <ESelect
            label="Status"
            value={formData.status || TravelStatus.UPCOMING}
            onChange={(val) => setFormData({ ...formData, status: val as TravelStatus })}
            options={STATUS_OPTIONS}
            placeholder="Select status"
          />

          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full h-11 rounded-xl bg-[#174824] hover:bg-[#174824]/90 text-white font-bold text-xs sm:text-sm shadow-md gap-2 cursor-pointer mt-1"
          >
            <span>Next: Transport Details</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 2: TRANSPORT DETAILS (Dynamic Mode-wise Fields)
         ══════════════════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <Card className="rounded-2xl p-4 sm:p-6 border border-[#e5d9c3] bg-[#fffdfa] shadow-xs space-y-4">
          <div className="border-b border-[#e5d9c3]/70 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#174824] flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-700" />
              <span>Step 2: Transport Details</span>
            </h2>
            <Badge className="bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
              Step 2 of 4
            </Badge>
          </div>

          {/* Select Mode of Transport Selector (3 items per row on mobile & desktop) */}
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
                    className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 cursor-pointer select-none ${isSelected
                        ? "border-[#174824] bg-[#174824]/10 shadow-xs scale-[1.02]"
                        : "border-[#e5d9c3] bg-[#faf5eb]/50 hover:bg-[#faf5eb]"
                      }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#174824] text-white" : "bg-[#fbf7f0] text-[#174824]"
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
                    onChange={(e) => setTransport({ ...transport, flightNo: e.target.value })}
                    placeholder="e.g. 6E-204"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="PNR"
                    value={transport.pnr || ""}
                    onChange={(e) => setTransport({ ...transport, pnr: e.target.value })}
                    placeholder="e.g. PNR-XY987Z (Optional)"
                  />
                  <ESelect
                    label="Seat Preference"
                    value={transport.seatPreference || "Aisle"}
                    onChange={(val) => setTransport({ ...transport, seatPreference: val })}
                    options={SEAT_PREFERENCE_OPTIONS}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Departure Airport"
                    value={transport.departureAirport || ""}
                    onChange={(e) => setTransport({ ...transport, departureAirport: e.target.value })}
                    placeholder="e.g. BOM - Mumbai"
                    required
                  />
                  <EInput
                    label="Arrival Airport"
                    value={transport.arrivalAirport || ""}
                    onChange={(e) => setTransport({ ...transport, arrivalAirport: e.target.value })}
                    placeholder="e.g. DEL - New Delhi"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EDateTimePicker
                    label="Departure Date & Time"
                    value={transport.departureTime}
                    minDate={formData.startDate}
                    onChange={(val) => setTransport({ ...transport, departureTime: val })}
                    required
                  />
                  <EDateTimePicker
                    label="Arrival Date & Time"
                    value={transport.arrivalTime}
                    minDate={transport.departureTime || formData.startDate}
                    onChange={(val) => setTransport({ ...transport, arrivalTime: val })}
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
                    onChange={(e) => setTransport({ ...transport, trainNameNo: e.target.value })}
                    placeholder="e.g. 12951 Rajdhani Express"
                    required
                  />
                  <EInput
                    label="PNR / Ticket Number"
                    value={transport.pnr || ""}
                    onChange={(e) => setTransport({ ...transport, pnr: e.target.value })}
                    placeholder="e.g. 245-1234567"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Coach & Seat Number"
                    value={transport.coachSeat || ""}
                    onChange={(e) => setTransport({ ...transport, coachSeat: e.target.value })}
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
                    onChange={(e) => setTransport({ ...transport, departureStation: e.target.value })}
                    placeholder="e.g. Mumbai Central (MMCT)"
                    required
                  />
                  <EInput
                    label="Arrival Station"
                    value={transport.arrivalStation || ""}
                    onChange={(e) => setTransport({ ...transport, arrivalStation: e.target.value })}
                    placeholder="e.g. Mathura Junction (MTJ)"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EDateTimePicker
                    label="Departure Date & Time"
                    value={transport.departureTime}
                    minDate={formData.startDate}
                    onChange={(val) => setTransport({ ...transport, departureTime: val })}
                    required
                  />
                  <EDateTimePicker
                    label="Arrival Date & Time"
                    value={transport.arrivalTime}
                    minDate={transport.departureTime || formData.startDate}
                    onChange={(val) => setTransport({ ...transport, arrivalTime: val })}
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
                    onChange={(e) => setTransport({ ...transport, carModel: e.target.value })}
                    placeholder="e.g. Toyota Innova (SUV)"
                    required
                  />
                  <EInput
                    label="Vehicle Number"
                    value={transport.vehicleNo || ""}
                    onChange={(e) => setTransport({ ...transport, vehicleNo: e.target.value })}
                    placeholder="e.g. MH 02 AB 1234"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Rental Agency / Provider Name"
                    value={transport.rentalAgency || ""}
                    onChange={(e) => setTransport({ ...transport, rentalAgency: e.target.value })}
                    placeholder="e.g. Zoomcar / Fleet"
                  />
                  <EInput
                    label="Booking Reference / Confirmation ID"
                    value={transport.bookingRef || ""}
                    onChange={(e) => setTransport({ ...transport, bookingRef: e.target.value })}
                    placeholder="e.g. BKG-CAR-909"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Pickup Location"
                    value={transport.pickupLocation || ""}
                    onChange={(e) => setTransport({ ...transport, pickupLocation: e.target.value })}
                    placeholder="Pickup address / spot"
                    required
                  />
                  <EDateTimePicker
                    label="Pickup Date & Time"
                    value={transport.departureTime}
                    minDate={formData.startDate}
                    onChange={(val) => setTransport({ ...transport, departureTime: val })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Drop-off Location"
                    value={transport.dropoffLocation || ""}
                    onChange={(e) => setTransport({ ...transport, dropoffLocation: e.target.value })}
                    placeholder="Drop-off address / spot"
                    required
                  />
                  <EDateTimePicker
                    label="Drop-off Date & Time"
                    value={transport.arrivalTime}
                    minDate={transport.departureTime || formData.startDate}
                    onChange={(val) => setTransport({ ...transport, arrivalTime: val })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2c221e]">Toll / Fastag Notes</label>
                  <textarea
                    value={transport.tollNotes || ""}
                    onChange={(e) => setTransport({ ...transport, tollNotes: e.target.value })}
                    rows={2}
                    placeholder="Fastag balance, toll details or parking instructions..."
                    className="w-full p-3 rounded-xl border border-[#cfa35d]/80 bg-[#fbf8f2] text-xs sm:text-sm font-medium text-[#2c221e] placeholder:text-[#8c7865]/70 outline-none focus:border-[#174824]"
                  />
                </div>
              </div>
            )}

            {/* 🚙 4. PICKUP / CAB (Chauffeur / Local Transit) */}
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
                    onChange={(e) => setTransport({ ...transport, cabProvider: e.target.value })}
                    placeholder="e.g. Temple Cab / Ola / Uber"
                    required
                  />
                  <EInput
                    label="Driver Name"
                    value={transport.driverName || ""}
                    onChange={(e) => setTransport({ ...transport, driverName: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Driver Contact Number"
                    type="tel"
                    value={transport.driverPhone || ""}
                    onChange={(e) => setTransport({ ...transport, driverPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                  />
                  <EInput
                    label="Vehicle Number"
                    value={transport.vehicleNo || ""}
                    onChange={(e) => setTransport({ ...transport, vehicleNo: e.target.value })}
                    placeholder="e.g. UP 85 AX 9999"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Pickup Location"
                    value={transport.pickupLocation || ""}
                    onChange={(e) => setTransport({ ...transport, pickupLocation: e.target.value })}
                    placeholder="e.g. Delhi Airport T3"
                    required
                  />
                  <EInput
                    label="Drop-off Location"
                    value={transport.dropoffLocation || ""}
                    onChange={(e) => setTransport({ ...transport, dropoffLocation: e.target.value })}
                    placeholder="e.g. ISKCON Vrindavan Guest House"
                    required
                  />
                </div>

                <EDateTimePicker
                  label="Pickup Date & Time"
                  value={transport.departureTime}
                  minDate={formData.startDate}
                  onChange={(val) => setTransport({ ...transport, departureTime: val })}
                  required
                />

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2c221e]">Instructions / Notes</label>
                  <textarea
                    value={transport.instructions || ""}
                    onChange={(e) => setTransport({ ...transport, instructions: e.target.value })}
                    rows={2}
                    placeholder="Driver pickup placard name, terminal meeting point..."
                    className="w-full p-3 rounded-xl border border-[#cfa35d]/80 bg-[#fbf8f2] text-xs sm:text-sm font-medium text-[#2c221e] placeholder:text-[#8c7865]/70 outline-none focus:border-[#174824]"
                  />
                </div>
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
                    onChange={(e) => setTransport({ ...transport, busOperator: e.target.value })}
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
                    onChange={(e) => setTransport({ ...transport, ticketRef: e.target.value })}
                    placeholder="e.g. ZING-8821"
                  />
                  <EInput
                    label="Seat Number"
                    value={transport.seatNo || ""}
                    onChange={(e) => setTransport({ ...transport, seatNo: e.target.value })}
                    placeholder="e.g. 12 (Lower Berth)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="Boarding Point"
                    value={transport.boardingPoint || ""}
                    onChange={(e) => setTransport({ ...transport, boardingPoint: e.target.value })}
                    placeholder="Boarding stop / station"
                    required
                  />
                  <EInput
                    label="Drop Point"
                    value={transport.dropPoint || ""}
                    onChange={(e) => setTransport({ ...transport, dropPoint: e.target.value })}
                    placeholder="Drop stop / station"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EDateTimePicker
                    label="Departure Date & Time"
                    value={transport.departureTime}
                    minDate={formData.startDate}
                    onChange={(val) => setTransport({ ...transport, departureTime: val })}
                    required
                  />
                  <EDateTimePicker
                    label="Arrival Date & Time"
                    value={transport.arrivalTime}
                    minDate={transport.departureTime || formData.startDate}
                    onChange={(val) => setTransport({ ...transport, arrivalTime: val })}
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
                    onChange={(e) => setTransport({ ...transport, modeDescription: e.target.value })}
                    placeholder="e.g. Mayapur Ferry, E-Rickshaw"
                    required
                  />
                  <EInput
                    label="Provider / Service Name"
                    value={transport.providerName || ""}
                    onChange={(e) => setTransport({ ...transport, providerName: e.target.value })}
                    placeholder="e.g. Local Ghat Seva"
                  />
                </div>

                <EInput
                  label="Reference / Ticket No"
                  value={transport.referenceNo || ""}
                  onChange={(e) => setTransport({ ...transport, referenceNo: e.target.value })}
                  placeholder="Ticket or receipt ref"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="From Location"
                    value={transport.fromLocation || ""}
                    onChange={(e) => setTransport({ ...transport, fromLocation: e.target.value })}
                    placeholder="Departure spot"
                    required
                  />
                  <EDateTimePicker
                    label="Departure Date & Time"
                    value={transport.departureTime}
                    minDate={formData.startDate}
                    onChange={(val) => setTransport({ ...transport, departureTime: val })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EInput
                    label="To Location"
                    value={transport.toLocation || ""}
                    onChange={(e) => setTransport({ ...transport, toLocation: e.target.value })}
                    placeholder="Destination spot"
                    required
                  />
                  <EDateTimePicker
                    label="Arrival Date & Time"
                    value={transport.arrivalTime}
                    minDate={transport.departureTime || formData.startDate}
                    onChange={(val) => setTransport({ ...transport, arrivalTime: val })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2c221e]">Notes</label>
                  <textarea
                    value={transport.notes || ""}
                    onChange={(e) => setTransport({ ...transport, notes: e.target.value })}
                    rows={2}
                    placeholder="Additional instructions..."
                    className="w-full p-3 rounded-xl border border-[#cfa35d]/80 bg-[#fbf8f2] text-xs sm:text-sm font-medium text-[#2c221e] placeholder:text-[#8c7865]/70 outline-none focus:border-[#174824]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              onClick={handlePrevStep}
              variant="outline"
              className="rounded-xl border-[#e5d9c3] text-[#5a4836]"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-bold px-5 gap-2"
            >
              <span>Next: Stay & Contacts</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 3: STAY & CONTACTS
         ══════════════════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <Card className="rounded-2xl p-4 sm:p-6 border border-[#e5d9c3] bg-[#fffdfa] shadow-xs space-y-4">
          <div className="border-b border-[#e5d9c3]/70 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#174824] flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-700" />
              <span>Step 3: Stay & Contacts</span>
            </h2>
            <Badge className="bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
              Step 3 of 5
            </Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ESelect
                label="Stay Type"
                value={formData.stayDetails?.type || AccommodationType.TEMPLE}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    stayDetails: {
                      ...formData.stayDetails,
                      type: val as AccommodationType,
                    },
                  })
                }
                options={STAY_TYPE_OPTIONS}
                required
              />

              <EInput
                label="Accommodation Name"
                value={formData.stayDetails?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stayDetails: { ...formData.stayDetails, name: e.target.value },
                  })
                }
                placeholder="e.g. ISKCON Vrindavan Guest House"
                required
              />
            </div>

            <EInput
              label="Address (Optional)"
              value={formData.stayDetails?.address || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stayDetails: { ...formData.stayDetails, address: e.target.value },
                })
              }
              placeholder="Full physical address or landmark"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <EDateTimePicker
                label="Check-in Date & Time"
                value={formData.stayDetails?.checkIn}
                minDate={formData.startDate}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    stayDetails: { ...formData.stayDetails, checkIn: val },
                  })
                }
              />
              <EDateTimePicker
                label="Check-out Date & Time"
                value={formData.stayDetails?.checkOut}
                minDate={formData.stayDetails?.checkIn || formData.startDate}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    stayDetails: { ...formData.stayDetails, checkOut: val },
                  })
                }
              />
              <EInput
                label="Booking Reference / Confirmation ID"
                value={formData.stayDetails?.bookingRef || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stayDetails: { ...formData.stayDetails, bookingRef: e.target.value },
                  })
                }
                placeholder="e.g. BKG-VRN-881"
              />
            </div>
          </div>

          {/* Contact Persons Repeatable List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-800" />
                  <span>Contact Persons ({formData.localContacts?.length || 0})</span>
                </span>
              </div>
              <Button
                type="button"
                onClick={() => {
                  const newContact: LocalContact = {
                    role: "Local Coordinator",
                    name: "",
                    phone: "+91 ",
                    email: "",
                  };
                  setFormData((prev) => {
                    const list = [...(prev.localContacts || []), newContact];
                    setEditingContactIndex(list.length - 1);
                    return { ...prev, localContacts: list };
                  });
                }}
                variant="outline"
                size="sm"
                className="rounded-xl border-[#cfa35d] text-[#174824] text-xs font-bold gap-1 cursor-pointer h-8"
              >
                <Plus className="w-3 h-3" />
                <span>Add Person</span>
              </Button>
            </div>

            {formData.localContacts?.map((contact, idx) => {
              const isEditing = editingContactIndex === idx;

              if (isEditing) {
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#fbf8f2] border-2 border-[#174824]/30 space-y-2.5 relative shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#174824]">Contact #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          removeContactPerson(idx);
                          setEditingContactIndex(null);
                        }}
                        className="text-red-700 hover:text-red-900 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <EInput
                        label="Name"
                        value={contact.name}
                        onChange={(e) => updateContactPerson(idx, { name: e.target.value })}
                        placeholder="e.g. Madhav Das"
                        required
                      />
                      <EInput
                        label="Role / Title"
                        value={contact.role}
                        onChange={(e) => updateContactPerson(idx, { role: e.target.value })}
                        placeholder="e.g. Temple President, Coordinator"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <EInput
                        label="Phone Number"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateContactPerson(idx, { phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        required
                      />
                      <EInput
                        label="Email"
                        type="email"
                        value={contact.email || ""}
                        onChange={(e) => updateContactPerson(idx, { email: e.target.value })}
                        placeholder="coordinator@samanvaya.com"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingContactIndex(null)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#174824] hover:bg-[#174824]/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#fffdfa] border border-[#e5d9c3] shadow-2xs hover:border-[#174824]/40 transition-all select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#174824]/10 text-[#174824] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {contact.name?.trim() ? contact.name.charAt(0).toUpperCase() : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-[#2c221e] truncate">
                          {contact.name || "Contact Person"}
                        </p>
                        {contact.role && (
                          <span className="text-[10px] bg-[#faf5eb] border border-[#e5d9c3] text-[#5a4836] px-1.5 py-0.5 rounded-md font-semibold truncate">
                            {contact.role}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8c7865] truncate font-medium">
                        {contact.phone} {contact.email ? `• ${contact.email}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingContactIndex(idx)}
                      className="p-1.5 rounded-lg hover:bg-[#faf5eb] text-[#174824] transition-colors cursor-pointer"
                      title="Edit contact"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeContactPerson(idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-700 transition-colors cursor-pointer"
                      title="Delete contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              onClick={handlePrevStep}
              variant="outline"
              className="rounded-xl border-[#e5d9c3] text-[#5a4836]"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-bold px-5 gap-2"
            >
              <span>Next: Review & Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════════════════
          STEP 4: REVIEW YOUR TRAVEL PLAN (Exact Mockup Match)
         ══════════════════════════════════════════════════════════ */}
      {currentStep === 4 && (
        <div className="space-y-4">
          {/* Main Review Card Container */}
          <Card className="rounded-[22px] sm:rounded-3xl p-4 sm:p-6 border border-[#e5d9c3] bg-[#fffdfa] shadow-sm space-y-0 divide-y divide-[#e5d9c3]/70">
            {/* Card Header */}
            <div className="pb-3.5 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#174824] font-serif-display">
                Review Your Travel Plan
              </h2>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
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
                    <span className="font-semibold text-[#174824]">{formData.fromLocation}</span> &rarr;{" "}
                    <span className="font-semibold text-[#174824]">{formData.destinationCity}</span> &bull;{" "}
                    {formData.purpose}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#174824]/10 text-[#174824] border border-[#174824]/20">
                  {formData.status || "Upcoming"}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
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
                  {transport.mode === TransportMode.FLIGHT && <Plane className="w-4 h-4 text-amber-700" />}
                  {transport.mode === TransportMode.TRAIN && <Train className="w-4 h-4 text-amber-700" />}
                  {transport.mode === TransportMode.CAR && <Car className="w-4 h-4 text-amber-700" />}
                  {transport.mode === TransportMode.PICKUP && <CarTaxiFront className="w-4 h-4 text-amber-700" />}
                  {transport.mode === TransportMode.BUS && <Bus className="w-4 h-4 text-amber-700" />}
                  {transport.mode === TransportMode.OTHER && <Navigation className="w-4 h-4 text-amber-700" />}
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
                      {transport.cabProvider} • Driver: {transport.driverPhone || "Assigned"}
                    </p>
                  )}
                  {transport.mode === TransportMode.BUS && (
                    <p className="text-xs text-[#5a4836] font-medium truncate">
                      {transport.busOperator} {transport.seatNo && `• Seat: ${transport.seatNo}`}
                    </p>
                  )}
                  {transport.mode === TransportMode.OTHER && (
                    <p className="text-xs text-[#5a4836] font-medium truncate">
                      {transport.modeDescription}
                    </p>
                  )}

                  <p className="text-[11px] text-[#8c7865]">
                    Departure: {new Date(transport.departureTime || formData.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &bull; Arrival: {new Date(transport.arrivalTime || formData.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                  onClick={() => setCurrentStep(2)}
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
                      Check-in: {new Date(formData.stayDetails.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} &bull; Check-out: {new Date(formData.stayDetails.checkOut || formData.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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
                  onClick={() => setCurrentStep(3)}
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
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#174824] hover:underline font-bold cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* 5. Notes Row */}
            <div className="py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                </div>
                <div className="min-w-0 space-y-1.5 flex-1">
                  <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                    Notes & Instructions
                  </p>
                  <textarea
                    rows={2}
                    value={formData.specialInstructions || ""}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="Add special instructions, prasadam arrangements, or coordination notes (optional)..."
                    className="w-full text-xs font-medium text-[#2c221e] bg-[#faf5eb]/50 rounded-xl border border-[#e5d9c3] focus:border-[#174824] outline-none p-2.5 placeholder:text-[#8c7865]/60 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Action: Big Full-Width Save Button */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              type="button"
              onClick={handlePrevStep}
              variant="outline"
              className="rounded-xl border-[#e5d9c3] text-[#5a4836] h-12 px-5 cursor-pointer font-bold text-xs"
            >
              Previous
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="flex-1 bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-bold h-12 text-sm sm:text-base shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "Saving Travel Plan..." : "Save Travel Plan"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
