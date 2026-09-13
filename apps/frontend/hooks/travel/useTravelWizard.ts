"use client";

import { useState, useRef, useEffect } from "react";
import useTravel from "./useTravel";
import {
  AccommodationType,
  CreateTravelPayload,
  LocalContact,
  TransportDetail,
  TransportMode,
  TravelCategory,
  TravelStatus,
} from "@/types/travel";

interface UseTravelWizardOptions {
  onSuccess?: () => void;
}

export function useTravelWizard(options: UseTravelWizardOptions = {}) {
  const { onSuccess } = options;
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
    category: TravelCategory.GENERAL,
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

  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(
    null
  );

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

    if (currentStep < 5) {
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
      ...(transport.seatPreference?.trim() && {
        seatPreference: transport.seatPreference.trim(),
      }),
      ...(transport.departureAirport?.trim() && {
        departureAirport: transport.departureAirport.trim(),
      }),
      ...(transport.arrivalAirport?.trim() && {
        arrivalAirport: transport.arrivalAirport.trim(),
      }),
      ...(transport.departureTime && {
        departureTime: new Date(transport.departureTime).toISOString(),
      }),
      ...(transport.arrivalTime && {
        arrivalTime: new Date(transport.arrivalTime).toISOString(),
      }),
      ...(transport.terminalGateClass?.trim() && {
        terminalGateClass: transport.terminalGateClass.trim(),
      }),
      ...(transport.trainNameNo?.trim() && {
        trainNameNo: transport.trainNameNo.trim(),
      }),
      ...(transport.coachSeat?.trim() && {
        coachSeat: transport.coachSeat.trim(),
      }),
      ...(transport.departureStation?.trim() && {
        departureStation: transport.departureStation.trim(),
      }),
      ...(transport.arrivalStation?.trim() && {
        arrivalStation: transport.arrivalStation.trim(),
      }),
      ...(transport.quota?.trim() && { quota: transport.quota.trim() }),
      ...(transport.carModel?.trim() && { carModel: transport.carModel.trim() }),
      ...(transport.vehicleNo?.trim() && {
        vehicleNo: transport.vehicleNo.trim(),
      }),
      ...(transport.rentalAgency?.trim() && {
        rentalAgency: transport.rentalAgency.trim(),
      }),
      ...(transport.pickupLocation?.trim() && {
        pickupLocation: transport.pickupLocation.trim(),
      }),
      ...(transport.dropoffLocation?.trim() && {
        dropoffLocation: transport.dropoffLocation.trim(),
      }),
      ...(transport.tollNotes?.trim() && {
        tollNotes: transport.tollNotes.trim(),
      }),
      ...(transport.cabProvider?.trim() && {
        cabProvider: transport.cabProvider.trim(),
      }),
      ...(transport.driverName?.trim() && {
        driverName: transport.driverName.trim(),
      }),
      ...(transport.driverPhone?.trim() && {
        driverPhone: transport.driverPhone.trim(),
      }),
      ...(transport.instructions?.trim() && {
        instructions: transport.instructions.trim(),
      }),
      ...(transport.busOperator?.trim() && {
        busOperator: transport.busOperator.trim(),
      }),
      ...(transport.busType?.trim() && { busType: transport.busType.trim() }),
      ...(transport.ticketRef?.trim() && {
        ticketRef: transport.ticketRef.trim(),
      }),
      ...(transport.seatNo?.trim() && { seatNo: transport.seatNo.trim() }),
      ...(transport.boardingPoint?.trim() && {
        boardingPoint: transport.boardingPoint.trim(),
      }),
      ...(transport.dropPoint?.trim() && {
        dropPoint: transport.dropPoint.trim(),
      }),
      ...(transport.modeDescription?.trim() && {
        modeDescription: transport.modeDescription.trim(),
      }),
      ...(transport.providerName?.trim() && {
        providerName: transport.providerName.trim(),
      }),
      ...(transport.referenceNo?.trim() && {
        referenceNo: transport.referenceNo.trim(),
      }),
      ...(transport.notes?.trim() && { notes: transport.notes.trim() }),
    };

    // 2. Sanitize stay details
    const cleanStay = formData.stayDetails
      ? {
          ...(formData.stayDetails.type && { type: formData.stayDetails.type }),
          name: formData.stayDetails.name?.trim() || "Temple Guest House",
          ...(formData.stayDetails.address?.trim() && {
            address: formData.stayDetails.address.trim(),
          }),
          ...(formData.stayDetails.bookingRef?.trim() && {
            bookingRef: formData.stayDetails.bookingRef.trim(),
          }),
          ...(formData.stayDetails.checkIn && {
            checkIn: new Date(formData.stayDetails.checkIn).toISOString(),
          }),
          ...(formData.stayDetails.checkOut && {
            checkOut: new Date(formData.stayDetails.checkOut).toISOString(),
          }),
          ...(formData.stayDetails.contactPersonName?.trim() && {
            contactPersonName: formData.stayDetails.contactPersonName.trim(),
          }),
          ...(formData.stayDetails.contactPersonPhone?.trim() && {
            contactPersonPhone: formData.stayDetails.contactPersonPhone.trim(),
          }),
        }
      : undefined;

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
      category: formData.category || TravelCategory.GENERAL,
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
      ...(cleanContacts &&
        cleanContacts.length > 0 && { localContacts: cleanContacts }),
      ...(formData.attachments &&
        formData.attachments.length > 0 && {
          attachments: formData.attachments.map((att) => ({
            category: att.category || "DOCUMENT",
            title: att.title,
            fileUrl: att.fileUrl,
            ...(att.fileType ? { fileType: att.fileType } : {}),
            ...(att.key ? { key: att.key } : {}),
          })),
        }),
      ...(formData.specialInstructions?.trim() && {
        specialInstructions: formData.specialInstructions.trim(),
      }),
      ...(formData.generalNotes?.trim() && {
        generalNotes: formData.generalNotes.trim(),
      }),
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

  const updateContactPerson = (
    index: number,
    fields: Partial<LocalContact>
  ) => {
    const updated = [...(formData.localContacts || [])];
    updated[index] = { ...updated[index], ...fields };
    setFormData({ ...formData, localContacts: updated });
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    transport,
    setTransport,
    editingContactIndex,
    setEditingContactIndex,
    formTopRef,
    isSubmitting,
    handleNextStep,
    handlePrevStep,
    handleFinalSubmit,
    addContactPerson,
    removeContactPerson,
    updateContactPerson,
  };
}

export default useTravelWizard;
