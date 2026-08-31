"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plane,
  Train,
  Car,
  Bus,
  CarTaxiFront,
  Navigation,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  Edit3,
  Luggage,
  Sparkles,
  Ticket,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import EInput from "@/components/common/EInput";
import ESelect from "@/components/common/ESelect";
import EDateTimePicker from "@/components/common/EDateTimePicker";
import S3Uploader from "@/components/common/S3Uploader";
import useTravel from "@/hooks/useTravel";
import {
  AccommodationType,
  CreateTravelPayload,
  ItineraryItem,
  LocalContact,
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

const TRANSPORT_MODES = [
  { mode: TransportMode.FLIGHT, label: "Flight", icon: Plane, desc: "Airlines & Air transit" },
  { mode: TransportMode.TRAIN, label: "Train", icon: Train, desc: "Railways & Express" },
  { mode: TransportMode.CAR, label: "Car", icon: Car, desc: "Self-driven or Rental" },
  { mode: TransportMode.PICKUP, label: "Pickup / Cab", icon: CarTaxiFront, desc: "Chauffeur & Local transit" },
  { mode: TransportMode.BUS, label: "Bus", icon: Bus, desc: "Intercity coach or Sleeper" },
  { mode: TransportMode.OTHER, label: "Other", icon: Navigation, desc: "Ferry, Rickshaw, Custom" },
];

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBackdatedParam = searchParams.get("backdated") === "true";

  const { createTravel, isSubmitting } = useTravel();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState<CreateTravelPayload>({
    title: "",
    purpose: "Preaching & Temple Seva Tour",
    fromLocation: "Mumbai",
    destinationCity: "Vrindavan",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    status: TravelStatus.UPCOMING,
    isBackdated: isBackdatedParam,
    transportDetails: [
      {
        mode: TransportMode.FLIGHT,
        airline: "IndiGo",
        flightNo: "6E-204",
        pnr: "",
        seatPreference: "Aisle",
        departureAirport: "BOM - Mumbai",
        arrivalAirport: "DEL - New Delhi",
        departureTime: new Date().toISOString().slice(0, 16),
        arrivalTime: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
      },
    ],
    stayDetails: {
      type: AccommodationType.TEMPLE,
      name: "ISKCON Vrindavan Temple Guest House",
      address: "Bhaktivedanta Swami Marg, Raman Reti, Vrindavan, UP 281121",
      checkIn: new Date().toISOString().slice(0, 16),
      checkOut: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
      bookingRef: "",
      contactPersonName: "Govinda Das",
      contactPersonPhone: "+91 98765 43210",
    },
    localContacts: [
      {
        role: "Temple Coordinator",
        name: "Madhav Das",
        phone: "+91 98765 11111",
        email: "madhav@samanvaya.com",
      },
    ],
    itinerary: [
      {
        dayNumber: 1,
        date: new Date().toISOString().split("T")[0],
        time: "05:00 PM",
        activityTitle: "Arrival, Guest House Check-in & Evening Sandhya Arati",
        location: "ISKCON Vrindavan Mandir",
        notes: "Attend evening darshan and greet local temple management.",
      },
    ],
    attachments: [],
    expenses: [],
    specialInstructions: "",
    generalNotes: "",
  });

  const [activeTransportIndex, setActiveTransportIndex] = useState(0);
  const [selectedItineraryDay, setSelectedItineraryDay] = useState(1);
  const [newAttachmentDocType, setNewAttachmentDocType] = useState("Ticket");

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
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = async () => {
    const result = await createTravel(formData);
    if (result) {
      router.push("/travel");
    }
  };

  // Dynamic Transport Handlers
  const addTransportLeg = () => {
    const newLeg: TransportDetail = {
      mode: TransportMode.PICKUP,
      cabProvider: "Local Temple Cab",
      driverName: "",
      driverPhone: "",
      pickupLocation: formData.destinationCity,
      dropoffLocation: formData.stayDetails?.name || "Temple Guest House",
      departureTime: formData.startDate,
      arrivalTime: formData.endDate,
    };
    setFormData((prev) => ({
      ...prev,
      transportDetails: [...(prev.transportDetails || []), newLeg],
    }));
    setActiveTransportIndex(formData.transportDetails?.length || 1);
  };

  const removeTransportLeg = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      transportDetails: prev.transportDetails?.filter((_, i) => i !== index),
    }));
    if (activeTransportIndex >= index && activeTransportIndex > 0) {
      setActiveTransportIndex(activeTransportIndex - 1);
    }
  };

  const updateActiveTransport = (fields: Partial<TransportDetail>) => {
    const updated = [...(formData.transportDetails || [])];
    if (!updated[activeTransportIndex]) {
      updated[activeTransportIndex] = { mode: TransportMode.FLIGHT };
    }
    updated[activeTransportIndex] = { ...updated[activeTransportIndex], ...fields };
    setFormData({ ...formData, transportDetails: updated });
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

  // Dynamic Itinerary Handlers
  const addItineraryItem = () => {
    const newItem: ItineraryItem = {
      dayNumber: selectedItineraryDay,
      time: "10:00 AM",
      activityTitle: "",
      location: formData.destinationCity,
      notes: "",
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newItem],
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary?.filter((_, i) => i !== index),
    }));
  };

  const updateItineraryItem = (index: number, fields: Partial<ItineraryItem>) => {
    const updated = [...(formData.itinerary || [])];
    updated[index] = { ...updated[index], ...fields };
    setFormData({ ...formData, itinerary: updated });
  };

  // Dynamic Attachments
  const handleAttachmentUploaded = (key: string, publicUrl: string) => {
    const newAttach: TravelAttachment = {
      category: newAttachmentDocType,
      title: `${newAttachmentDocType} - ${new Date().toLocaleDateString()}`,
      fileUrl: publicUrl,
      key,
      uploadedAt: new Date().toISOString(),
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAttach],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index),
    }));
  };

  const currentTransport = formData.transportDetails?.[activeTransportIndex] || {
    mode: TransportMode.FLIGHT,
  };

  const stepsList = [
    { num: 1, label: "Basic", title: "Basic Details" },
    { num: 2, label: "Transport", title: "Transport Details" },
    { num: 3, label: "Stay & Contacts", title: "Stay & Contacts" },
    { num: 4, label: "Tasks & Itinerary", title: "Tasks & Itinerary" },
    { num: 5, label: "Review", title: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen bg-[#faf5eb] flex flex-col justify-between">
      {/* ─── TOP NAV BAR ─── */}
      <header className="sticky top-0 z-30 bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#e5d9c3] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => router.push("/travel")}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#174824] hover:text-[#174824]/80 transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Travel Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <h1 className="font-serif-display text-lg sm:text-xl font-bold text-[#174824]">
            Create Travel
          </h1>
        </div>

        <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
          <Image
            src="/assets/04_lotus_icon_gold.png"
            alt="Lotus Emblem"
            fill
            className="object-contain"
          />
        </div>
      </header>

      {/* ─── MAIN FORM CONTAINER ─── */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6 flex-1">
        {/* ─── 5-STEP NUMBERED STEPPER (Exact design match) ─── */}
        <div className="bg-[#fffdfa] border border-[#e5d9c3] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
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
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                      isActive
                        ? "bg-[#174824] text-white ring-4 ring-[#174824]/20 scale-110"
                        : isCompleted
                        ? "bg-[#174824] text-white"
                        : "bg-[#fbf7f0] border border-[#cfa35d] text-[#5a4836]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold tracking-tight text-center ${
                      isActive
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
            STEP 1: BASIC DETAILS (Using Sacred EInput, ESelect & EDateTimePicker)
           ══════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <Card className="rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-[#e5d9c3] bg-[#fffdfa] shadow-sm space-y-5">
            <div className="border-b border-[#e5d9c3]/70 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#174824] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-700" />
                <span>Basic Details</span>
              </h2>
              <Badge className="bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
                Step 1 of 5
              </Badge>
            </div>

            {/* Event / Travel Name */}
            <EInput
              label="Event / Travel Name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Vrindavan Visit"
              required
            />

            {/* Sacred ESelect: Purpose of Travel */}
            <ESelect
              label="Purpose of Travel"
              value={formData.purpose}
              onChange={(val) => setFormData({ ...formData, purpose: val })}
              options={PURPOSE_OPTIONS}
              placeholder="Select purpose"
              required
            />

            {/* Sacred ESelect: From & To Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Sacred EDateTimePicker: Start & End Date-Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <EDateTimePicker
                label="Start Date & Time"
                value={formData.startDate}
                onChange={(val) => setFormData({ ...formData, startDate: val })}
                placeholder="Select date & time"
                required
              />

              <EDateTimePicker
                label="End Date & Time"
                value={formData.endDate}
                onChange={(val) => setFormData({ ...formData, endDate: val })}
                placeholder="Select date & time"
                required
              />
            </div>

            {/* Sacred ESelect: Status */}
            <ESelect
              label="Status"
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val as TravelStatus })}
              options={STATUS_OPTIONS}
              placeholder="Select status"
            />

            {/* Next Action Button */}
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full h-12 rounded-xl bg-[#174824] hover:bg-[#174824]/90 text-white font-bold text-sm shadow-md gap-2 cursor-pointer mt-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 2: TRANSPORT DETAILS (Dynamic Mode-wise Fields)
           ══════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <Card className="rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-[#e5d9c3] bg-[#fffdfa] shadow-sm space-y-6">
            <div className="border-b border-[#e5d9c3]/70 pb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#174824] flex items-center gap-2">
                  <Plane className="w-5 h-5 text-amber-700" />
                  <span>Transport Details (Dynamic Mode-wise)</span>
                </h2>
                <p className="text-xs text-[#5a4836]">
                  Select the mode of travel to fill required booking and transit details.
                </p>
              </div>
              <Button
                type="button"
                onClick={addTransportLeg}
                variant="outline"
                size="sm"
                className="rounded-xl border-[#cfa35d] text-[#174824] hover:bg-[#174824] hover:text-white text-xs font-bold gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Leg</span>
              </Button>
            </div>

            {/* Multi-Leg Tabs if multiple transport legs exist */}
            {(formData.transportDetails?.length || 0) > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {formData.transportDetails?.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTransportIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none flex-shrink-0 ${
                      activeTransportIndex === idx
                        ? "bg-[#174824] text-white border-[#174824]"
                        : "bg-[#fbf8f2] text-[#5a4836] border-[#e5d9c3] hover:border-[#174824]/40"
                    }`}
                  >
                    <span>Leg #{idx + 1} ({t.mode})</span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTransportLeg(idx);
                        }}
                        className="hover:text-red-300 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mode of Transport Card Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2c221e]">
                Select Mode of Transport <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TRANSPORT_MODES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = currentTransport.mode === item.mode;

                  return (
                    <div
                      key={item.mode}
                      onClick={() => updateActiveTransport({ mode: item.mode })}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none ${
                        isSelected
                          ? "border-[#174824] bg-[#174824]/10 shadow-xs scale-[1.02]"
                          : "border-[#e5d9c3] bg-[#faf5eb]/50 hover:bg-[#faf5eb] hover:border-[#174824]/40"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-[#174824] text-white" : "bg-[#fbf7f0] text-[#174824]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2c221e]">{item.label}</p>
                        <p className="text-[10px] text-[#8c7865] hidden sm:block">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── DYNAMIC MODE-WISE FIELDS ─── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-4">
              {/* ✈️ 1. FLIGHT FIELDS */}
              {currentTransport.mode === TransportMode.FLIGHT && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174824] border-b border-[#e5d9c3] pb-2">
                    <Plane className="w-4 h-4" />
                    <span>Flight Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Airline"
                      value={currentTransport.airline || ""}
                      onChange={(e) => updateActiveTransport({ airline: e.target.value })}
                      placeholder="e.g. IndiGo, Air India, Vistara"
                      required
                    />
                    <EInput
                      label="Flight Number"
                      value={currentTransport.flightNo || ""}
                      onChange={(e) => updateActiveTransport({ flightNo: e.target.value })}
                      placeholder="e.g. 6E-204"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="PNR / Ticket Number"
                      value={currentTransport.pnr || ""}
                      onChange={(e) => updateActiveTransport({ pnr: e.target.value })}
                      placeholder="e.g. PNR-XY987Z"
                    />
                    <ESelect
                      label="Seat Preference"
                      value={currentTransport.seatPreference || "Aisle"}
                      onChange={(val) => updateActiveTransport({ seatPreference: val })}
                      options={SEAT_PREFERENCE_OPTIONS}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Departure Airport"
                      value={currentTransport.departureAirport || ""}
                      onChange={(e) => updateActiveTransport({ departureAirport: e.target.value })}
                      placeholder="e.g. BOM - Chhatrapati Shivaji Airport"
                      required
                    />
                    <EInput
                      label="Arrival Airport"
                      value={currentTransport.arrivalAirport || ""}
                      onChange={(e) => updateActiveTransport({ arrivalAirport: e.target.value })}
                      placeholder="e.g. DEL - Indira Gandhi Airport"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EDateTimePicker
                      label="Departure Date & Time"
                      value={currentTransport.departureTime}
                      onChange={(val) => updateActiveTransport({ departureTime: val })}
                      required
                    />
                    <EDateTimePicker
                      label="Arrival Date & Time"
                      value={currentTransport.arrivalTime}
                      onChange={(val) => updateActiveTransport({ arrivalTime: val })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* 🚆 2. TRAIN FIELDS */}
              {currentTransport.mode === TransportMode.TRAIN && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174824] border-b border-[#e5d9c3] pb-2">
                    <Train className="w-4 h-4" />
                    <span>Train Transit Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Train Name / Number"
                      value={currentTransport.trainNameNo || ""}
                      onChange={(e) => updateActiveTransport({ trainNameNo: e.target.value })}
                      placeholder="e.g. 12951 Rajdhani Express"
                      required
                    />
                    <EInput
                      label="PNR / Ticket Number"
                      value={currentTransport.pnr || ""}
                      onChange={(e) => updateActiveTransport({ pnr: e.target.value })}
                      placeholder="e.g. 245-1234567"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Coach & Seat Number"
                      value={currentTransport.coachSeat || ""}
                      onChange={(e) => updateActiveTransport({ coachSeat: e.target.value })}
                      placeholder="e.g. B2 - 42 (Lower Berth)"
                    />
                    <ESelect
                      label="Quota"
                      value={currentTransport.quota || "General"}
                      onChange={(val) => updateActiveTransport({ quota: val })}
                      options={TRAIN_QUOTA_OPTIONS}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Departure Station"
                      value={currentTransport.departureStation || ""}
                      onChange={(e) => updateActiveTransport({ departureStation: e.target.value })}
                      placeholder="e.g. Mumbai Central (MMCT)"
                      required
                    />
                    <EInput
                      label="Arrival Station"
                      value={currentTransport.arrivalStation || ""}
                      onChange={(e) => updateActiveTransport({ arrivalStation: e.target.value })}
                      placeholder="e.g. Mathura Junction (MTJ)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EDateTimePicker
                      label="Departure Date & Time"
                      value={currentTransport.departureTime}
                      onChange={(val) => updateActiveTransport({ departureTime: val })}
                    />
                    <EDateTimePicker
                      label="Arrival Date & Time"
                      value={currentTransport.arrivalTime}
                      onChange={(val) => updateActiveTransport({ arrivalTime: val })}
                    />
                  </div>
                </div>
              )}

              {/* 🚗 3. CAR / RENTAL FIELDS */}
              {currentTransport.mode === TransportMode.CAR && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174824] border-b border-[#e5d9c3] pb-2">
                    <Car className="w-4 h-4" />
                    <span>Car (Self-driven / Rental) Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Car Model / Type"
                      value={currentTransport.carModel || ""}
                      onChange={(e) => updateActiveTransport({ carModel: e.target.value })}
                      placeholder="e.g. Toyota Innova Crysta (SUV)"
                      required
                    />
                    <EInput
                      label="Vehicle Registration No"
                      value={currentTransport.vehicleNo || ""}
                      onChange={(e) => updateActiveTransport({ vehicleNo: e.target.value })}
                      placeholder="e.g. MH 02 AB 1234"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Rental Agency / Provider"
                      value={currentTransport.rentalAgency || ""}
                      onChange={(e) => updateActiveTransport({ rentalAgency: e.target.value })}
                      placeholder="e.g. Zoomcar / Temple Fleet"
                    />
                    <EInput
                      label="Booking Reference ID"
                      value={currentTransport.bookingRef || ""}
                      onChange={(e) => updateActiveTransport({ bookingRef: e.target.value })}
                      placeholder="e.g. CAR-REF-9021"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Pickup Spot"
                      value={currentTransport.pickupLocation || ""}
                      onChange={(e) => updateActiveTransport({ pickupLocation: e.target.value })}
                      placeholder="Pickup spot / address"
                    />
                    <EInput
                      label="Drop-off Spot"
                      value={currentTransport.dropoffLocation || ""}
                      onChange={(e) => updateActiveTransport({ dropoffLocation: e.target.value })}
                      placeholder="Drop-off spot / address"
                    />
                  </div>
                </div>
              )}

              {/* 🚙 4. PICKUP / CAB FIELDS */}
              {currentTransport.mode === TransportMode.PICKUP && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174824] border-b border-[#e5d9c3] pb-2">
                    <CarTaxiFront className="w-4 h-4" />
                    <span>Pickup / Cab (Chauffeur Transit)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Cab Provider / Service"
                      value={currentTransport.cabProvider || ""}
                      onChange={(e) => updateActiveTransport({ cabProvider: e.target.value })}
                      placeholder="e.g. Temple Driver / Ola / Uber"
                      required
                    />
                    <EInput
                      label="Driver Name"
                      value={currentTransport.driverName || ""}
                      onChange={(e) => updateActiveTransport({ driverName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Driver Contact Number"
                      type="tel"
                      value={currentTransport.driverPhone || ""}
                      onChange={(e) => updateActiveTransport({ driverPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />
                    <EInput
                      label="Vehicle Number"
                      value={currentTransport.vehicleNo || ""}
                      onChange={(e) => updateActiveTransport({ vehicleNo: e.target.value })}
                      placeholder="e.g. UP 85 AX 9999"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Pickup Spot"
                      value={currentTransport.pickupLocation || ""}
                      onChange={(e) => updateActiveTransport({ pickupLocation: e.target.value })}
                      placeholder="e.g. Delhi Airport Terminal 3 Gate 4"
                      required
                    />
                    <EInput
                      label="Drop Location"
                      value={currentTransport.dropoffLocation || ""}
                      onChange={(e) => updateActiveTransport({ dropoffLocation: e.target.value })}
                      placeholder="e.g. ISKCON Guest House Vrindavan"
                      required
                    />
                  </div>
                </div>
              )}

              {/* 🚌 5. BUS FIELDS */}
              {currentTransport.mode === TransportMode.BUS && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174824] border-b border-[#e5d9c3] pb-2">
                    <Bus className="w-4 h-4" />
                    <span>Bus Operator Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Bus Operator / Travels Name"
                      value={currentTransport.busOperator || ""}
                      onChange={(e) => updateActiveTransport({ busOperator: e.target.value })}
                      placeholder="e.g. Zingbus / IntrCity SmartBus"
                      required
                    />
                    <ESelect
                      label="Bus Type"
                      value={currentTransport.busType || "Volvo Multi-Axle AC Sleeper"}
                      onChange={(val) => updateActiveTransport({ busType: val })}
                      options={BUS_TYPE_OPTIONS}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Boarding Point"
                      value={currentTransport.boardingPoint || ""}
                      onChange={(e) => updateActiveTransport({ boardingPoint: e.target.value })}
                      placeholder="Boarding station / stop"
                      required
                    />
                    <EInput
                      label="Drop Point"
                      value={currentTransport.dropPoint || ""}
                      onChange={(e) => updateActiveTransport({ dropPoint: e.target.value })}
                      placeholder="Drop-off station / stop"
                      required
                    />
                  </div>
                </div>
              )}

              {/* ⚙️ 6. OTHER CUSTOM TRANSIT */}
              {currentTransport.mode === TransportMode.OTHER && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#174824] border-b border-[#e5d9c3] pb-2">
                    <Navigation className="w-4 h-4" />
                    <span>Custom / Other Transit</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Mode Description"
                      value={currentTransport.modeDescription || ""}
                      onChange={(e) => updateActiveTransport({ modeDescription: e.target.value })}
                      placeholder="e.g. Mayapur Ferry, Auto Rickshaw, E-Rickshaw"
                      required
                    />
                    <EInput
                      label="Provider / Service"
                      value={currentTransport.providerName || ""}
                      onChange={(e) => updateActiveTransport({ providerName: e.target.value })}
                      placeholder="e.g. Local Boat Seva"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                onClick={handlePrevStep}
                variant="outline"
                className="rounded-xl border-[#e5d9c3] text-[#5a4836] hover:bg-[#faf5eb]"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-bold px-6 gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 3: STAY & CONTACTS (Using Sacred EInput, ESelect & EDateTimePicker)
           ══════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <Card className="rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-[#e5d9c3] bg-[#fffdfa] shadow-sm space-y-6">
            <div className="border-b border-[#e5d9c3]/70 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#174824] flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-700" />
                <span>Accommodation & Contact Persons</span>
              </h2>
              <Badge className="bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
                Step 3 of 5
              </Badge>
            </div>

            {/* Accommodation Details */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-4">
              <h3 className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-800" />
                <span>Stay Information</span>
              </h3>

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
                  placeholder="e.g. ISKCON Krishna Balaram Guest House"
                  required
                />
              </div>

              <EInput
                label="Address"
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
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      stayDetails: { ...formData.stayDetails, checkOut: val },
                    })
                  }
                />
                <EInput
                  label="Booking Reference ID"
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

            {/* Dynamic Repeatable Contact Persons List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-800" />
                    <span>Contact Persons & Local Coordinators</span>
                  </h3>
                  <p className="text-[11px] text-[#8c7865]">
                    Add local temple coordinators, drivers, and assistance contacts.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addContactPerson}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#cfa35d] text-[#174824] hover:bg-[#174824] hover:text-white text-xs font-bold gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Person</span>
                </Button>
              </div>

              {formData.localContacts?.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#174824]">Contact #{idx + 1}</span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeContactPerson(idx)}
                        className="text-red-700 hover:text-red-900 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      placeholder="e.g. Temple President, Local Coordinator, Driver"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <EInput
                      label="Phone Number"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContactPerson(idx, { phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />

                    <EInput
                      label="Email (Optional)"
                      type="email"
                      value={contact.email || ""}
                      onChange={(e) => updateContactPerson(idx, { email: e.target.value })}
                      placeholder="coordinator@samanvaya.com"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
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
                className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-bold px-6 gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 4: TASKS, DAY-WISE ITINERARY & S3 ATTACHMENTS
           ══════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <Card className="rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-[#e5d9c3] bg-[#fffdfa] shadow-sm space-y-6">
            <div className="border-b border-[#e5d9c3]/70 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#174824] flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <span>Itinerary & S3 File Attachments</span>
              </h2>
              <Badge className="bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
                Step 4 of 5
              </Badge>
            </div>

            {/* Day-wise Itinerary Items */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-800" />
                    <span>Day-wise Schedule Timeline</span>
                  </h3>
                  <p className="text-[11px] text-[#8c7865]">
                    Plan darshan times, preaching schedules, and seva appointments.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addItineraryItem}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#cfa35d] text-[#174824] text-xs font-bold gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </Button>
              </div>

              {/* Itinerary Activity List */}
              <div className="space-y-3">
                {formData.itinerary?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[#e5d9c3] space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                        Activity #{idx + 1}
                      </span>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryItem(idx)}
                          className="text-red-700 hover:text-red-900 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <EInput
                        label="Time"
                        value={item.time || ""}
                        onChange={(e) => updateItineraryItem(idx, { time: e.target.value })}
                        placeholder="e.g. 06:30 AM"
                        required
                      />
                      <div className="sm:col-span-2">
                        <EInput
                          label="Activity Title"
                          value={item.activityTitle}
                          onChange={(e) => updateItineraryItem(idx, { activityTitle: e.target.value })}
                          placeholder="e.g. Mangala Arati & Srila Prabhupada Samadhi Darshan"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <EInput
                        value={item.location || ""}
                        onChange={(e) => updateItineraryItem(idx, { location: e.target.value })}
                        placeholder="Venue / Temple / Hall"
                      />
                      <EInput
                        value={item.notes || ""}
                        onChange={(e) => updateItineraryItem(idx, { notes: e.target.value })}
                        placeholder="Notes / instructions (e.g. Prasadam arranged)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* S3 File Uploads Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-amber-800" />
                    <span>Files & S3 Document Uploads</span>
                  </h3>
                  <p className="text-[11px] text-[#8c7865]">
                    Upload tickets, hotel vouchers, ID proofs directly to secure S3 storage.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ESelect
                  label="Document Category"
                  value={newAttachmentDocType}
                  onChange={(val) => setNewAttachmentDocType(val)}
                  options={DOC_CATEGORY_OPTIONS}
                />

                <div className="sm:col-span-2">
                  <S3Uploader
                    folder="travel/documents"
                    accept="image/*,application/pdf"
                    maxSizeMB={15}
                    label={`Upload ${newAttachmentDocType} File`}
                    variant="compact"
                    onUploadSuccess={handleAttachmentUploaded}
                  />
                </div>
              </div>

              {/* Uploaded Attachments Chips */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#e5d9c3]/70">
                  <p className="text-[11px] font-bold text-[#174824]">Uploaded Travel Documents:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-700" />
                        <span className="truncate max-w-[200px]">{att.title}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-red-700 hover:text-red-900 cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#5a4836]">
                Special Instructions / Notes
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                rows={2}
                placeholder="Any special diet, prasadam preference, seva schedule, or tour notes..."
                className="w-full p-3.5 rounded-xl border border-[#cfa35d]/80 bg-[#fbf8f2] text-xs sm:text-sm font-medium text-[#2c221e] placeholder:text-[#8c7865]/70 outline-none focus:outline-none focus:border-[#174824] focus:bg-[#fffdfa] focus:ring-2 focus:ring-[#174824]/20 shadow-2xs"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
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
                className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-bold px-6 gap-2"
              >
                <span>Proceed to Review</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 5: REVIEW & FINAL ATOMIC SUBMIT
           ══════════════════════════════════════════════════════════ */}
        {currentStep === 5 && (
          <Card className="rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-[#e5d9c3] bg-[#fffdfa] shadow-sm space-y-6">
            <div className="border-b border-[#e5d9c3]/70 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#174824] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Review Travel Plan</span>
                </h2>
                <p className="text-xs text-[#5a4836]">
                  Review all details before saving to the database in one atomic entry.
                </p>
              </div>
              <Badge className="bg-emerald-100 border border-emerald-300 text-emerald-950 text-[10px] font-bold">
                Final Step 5
              </Badge>
            </div>

            {/* 1. Basic Details Summary Card */}
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Basic Details</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#174824] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-sm font-bold text-[#2c221e]">{formData.title}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#5a4836]">
                <p><span className="font-semibold">Purpose:</span> {formData.purpose}</p>
                <p><span className="font-semibold">Route:</span> {formData.fromLocation} → {formData.destinationCity}</p>
                <p><span className="font-semibold">Status:</span> {formData.status}</p>
                <p className="col-span-2 sm:col-span-3">
                  <span className="font-semibold">Dates:</span> {new Date(formData.startDate).toLocaleString()} → {new Date(formData.endDate).toLocaleString()}
                </p>
              </div>
            </div>

            {/* 2. Transport Details Summary Card */}
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-amber-700" />
                  <span>Transport Legs ({formData.transportDetails?.length || 0})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-[#174824] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.transportDetails?.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#e5d9c3] text-xs space-y-1">
                    <p className="font-bold text-[#174824]">
                      Leg #{idx + 1}: {t.mode} ({t.airline || t.trainNameNo || t.carModel || t.cabProvider || t.busOperator || "Standard Transit"})
                    </p>
                    <p className="text-[#5a4836]">
                      {t.flightNo && `Flight: ${t.flightNo}`} {t.pnr && `| PNR: ${t.pnr}`}{" "}
                      {t.driverPhone && `| Driver Phone: ${t.driverPhone}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Stay & Contacts Summary Card */}
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-700" />
                  <span>Stay & Local Contacts</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-[#174824] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-xs text-[#2c221e] font-bold">{formData.stayDetails?.name}</p>
              <p className="text-xs text-[#5a4836]">{formData.stayDetails?.address}</p>
              <div className="pt-1">
                <p className="text-[11px] font-bold text-[#174824]">Key Contacts:</p>
                {formData.localContacts?.map((c, idx) => (
                  <p key={idx} className="text-xs text-[#5a4836]">
                    • <span className="font-semibold">{c.name}</span> ({c.role}): {c.phone}
                  </p>
                ))}
              </div>
            </div>

            {/* 4. Itinerary & Attachments Summary */}
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#174824] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Itinerary & Attachments</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs font-bold text-[#174824] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-xs text-[#5a4836]">
                <span className="font-semibold">Itinerary Activities:</span> {formData.itinerary?.length || 0} scheduled
              </p>
              <p className="text-xs text-[#5a4836]">
                <span className="font-semibold">S3 Attachments:</span> {formData.attachments?.length || 0} files uploaded
              </p>
            </div>

            {/* Final Submit Button */}
            <div className="flex items-center justify-between pt-2">
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
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold px-8 h-12 gap-2 shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? "Saving Travel Plan..." : "Confirm & Save Travel Plan"}</span>
              </Button>
            </div>
          </Card>
        )}

        {/* ─── INACTIVE STEP ACCORDIONS (Visual collapsed steps matching design) ─── */}
        <div className="space-y-2.5">
          {stepsList
            .filter((s) => s.num !== currentStep)
            .map((step) => {
              const isPast = step.num < currentStep;

              return (
                <div
                  key={step.num}
                  onClick={() => {
                    if (isPast || (currentStep === 1 && formData.title.trim())) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className="bg-[#fffdfa] border border-[#e5d9c3] rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all hover:bg-[#faf5eb] cursor-pointer select-none shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isPast ? "bg-[#174824] text-white" : "bg-[#fbf7f0] border border-[#cfa35d] text-[#5a4836]"
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : step.num}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#174824]">
                      {step.title}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#8c7865]" />
                </div>
              );
            })}
        </div>
      </main>

      {/* ─── SACRED FOOTER ARTWORK & QUOTE (Exact design match) ─── */}
      <footer className="mt-8 pt-8 pb-6 text-center space-y-2 border-t border-[#e5d9c3]/40 bg-gradient-to-t from-[#f5ede0] to-transparent">
        <div className="relative w-10 h-10 mx-auto opacity-80">
          <Image
            src="/assets/04_lotus_icon_gold.png"
            alt="Lotus Flower"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-xs sm:text-sm font-serif-display italic text-[#174824] max-w-md mx-auto px-4 font-semibold">
          &ldquo;Every journey is an opportunity to serve and spread Krishna Consciousness.&rdquo;
        </p>
        <p className="text-[10px] text-[#8c7865] font-bold uppercase tracking-widest">
          Samanvaya &bull; Organise &bull; Coordinate &bull; Serve
        </p>
      </footer>
    </div>
  );
}

export default function CreateTravelWizardPage() {
  return (
    <SacredPortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-[#174824] font-bold">Loading travel wizard...</div>}>
        <WizardContent />
      </Suspense>
    </SacredPortalLayout>
  );
}
