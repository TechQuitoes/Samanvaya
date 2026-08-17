"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plane,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Building,
  User,
  Phone,
  FileText,
  DollarSign,
  Save,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import useTravel from "@/hooks/useTravel";
import {
  AccommodationType,
  CreateTravelPayload,
  TransportMode,
} from "@/types/travel";

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBackdatedParam = searchParams.get("backdated") === "true";

  const { createTravel, isSubmitting } = useTravel();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<CreateTravelPayload>({
    title: "",
    purpose: "Preaching & Temple Seva Tour",
    fromLocation: "Mumbai",
    destinationCity: "Vrindavan",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    isBackdated: isBackdatedParam,
    transportDetails: [
      {
        mode: TransportMode.FLIGHT,
        flightNo: "",
        pnr: "",
        notes: "",
      },
    ],
    stayDetails: {
      type: AccommodationType.TEMPLE,
      name: "ISKCON Vrindavan Temple Guest House",
      address: "Bhaktivedanta Swami Marg, Raman Reti, Vrindavan",
      contactPersonName: "Govinda Das",
      contactPersonPhone: "+91 98765 43210",
    },
    localContacts: [
      {
        role: "COORDINATOR",
        name: "Madhav Das",
        phone: "+91 98765 11111",
      },
    ],
    attachments: [],
    expenses: [],
    specialInstructions: "",
    generalNotes: "",
  });

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.title.trim()) {
      alert("Please enter a Travel / Event Name.");
      return;
    }
    if (currentStep < 6) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    const result = await createTravel(formData);
    if (result) {
      router.push("/travel");
    }
  };

  const addTransport = () => {
    setFormData((prev) => ({
      ...prev,
      transportDetails: [
        ...(prev.transportDetails || []),
        { mode: TransportMode.CAR, driverName: "", vehicleNo: "" },
      ],
    }));
  };

  const removeTransport = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      transportDetails: prev.transportDetails?.filter((_, i) => i !== index),
    }));
  };

  const addExpense = () => {
    setFormData((prev) => ({
      ...prev,
      expenses: [
        ...(prev.expenses || []),
        { title: "Transport Ticket", category: "TRANSPORT", amount: 1500, currency: "INR" },
      ],
    }));
  };

  const removeExpense = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses?.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {/* Header & Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/travel")}
          className="flex items-center gap-1.5 text-xs font-bold text-[#174824] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Travel Listing</span>
        </button>

        {formData.isBackdated && (
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full">
            Logging Backdated Entry
          </span>
        )}
      </div>

      <LotusDivider maxWidth="full" iconSize={20} className="my-1" />

      {/* Multi-Step Wizard Indicator */}
      <div className="bg-[#faf4e8] border border-[#e5d9c3] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#5a4836] mb-2">
          <span>Multi-Step Creation Workflow</span>
          <span>Step {currentStep} of 6</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                step <= currentStep ? "bg-[#174824]" : "bg-[#e5d9c3]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Basic Details */}
      {currentStep === 1 && (
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <h3 className="text-lg font-bold text-[#174824]">
            Step 1: Basic Travel Details
          </h3>

          <Input
            label="Event / Travel Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Vrindavan Preaching Tour & Temple Inauguration"
            required
          />

          <Input
            label="Purpose of Travel"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="e.g. Temple Opening & Diksha Ceremony"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="From Location *"
              value={formData.fromLocation}
              onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
              placeholder="e.g. Mumbai"
            />
            <Input
              label="Destination City *"
              value={formData.destinationCity}
              onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
              placeholder="e.g. Vrindavan"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date *"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              type="date"
              label="End Date *"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </Card>
      )}

      {/* STEP 2: Transport Details */}
      {currentStep === 2 && (
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#174824]">
              Step 2: Transport & Transit Modes
            </h3>
            <Button
              type="button"
              onClick={addTransport}
              variant="outline"
              className="rounded-xl text-xs border-[#cfa35d]"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Transport
            </Button>
          </div>

          {formData.transportDetails?.map((t, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#fcfaf5] border border-[#e5d9c3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#174824]">Transport #{idx + 1}</span>
                {idx > 0 && (
                  <button type="button" onClick={() => removeTransport(idx)} className="text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5a4836]">Mode</label>
                  <select
                    value={t.mode}
                    onChange={(e) => {
                      const updated = [...(formData.transportDetails || [])];
                      updated[idx].mode = e.target.value as TransportMode;
                      setFormData({ ...formData, transportDetails: updated });
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-[#cfa35d] bg-white text-xs"
                  >
                    <option value={TransportMode.FLIGHT}>FLIGHT</option>
                    <option value={TransportMode.TRAIN}>TRAIN</option>
                    <option value={TransportMode.CAR}>CAR / TAXI</option>
                    <option value={TransportMode.BUS}>BUS</option>
                    <option value={TransportMode.PICKUP}>PICKUP</option>
                  </select>
                </div>

                <Input
                  label="Flight / Train No / Vehicle"
                  value={t.flightNo || t.trainNo || t.vehicleNo || ""}
                  onChange={(e) => {
                    const updated = [...(formData.transportDetails || [])];
                    updated[idx].flightNo = e.target.value;
                    setFormData({ ...formData, transportDetails: updated });
                  }}
                  placeholder="e.g. 6E-204 / UK-811"
                />

                <Input
                  label="PNR / Seat / Driver Contact"
                  value={t.pnr || t.driverPhone || ""}
                  onChange={(e) => {
                    const updated = [...(formData.transportDetails || [])];
                    updated[idx].pnr = e.target.value;
                    setFormData({ ...formData, transportDetails: updated });
                  }}
                  placeholder="e.g. PNR: XYZ123"
                />
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* STEP 3: Stay & Local Contacts */}
      {currentStep === 3 && (
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <h3 className="text-lg font-bold text-[#174824]">
            Step 3: Accommodation & Local Contacts
          </h3>

          <div className="space-y-3 p-4 rounded-2xl bg-[#fcfaf5] border border-[#e5d9c3]">
            <h4 className="text-xs font-bold text-[#174824] uppercase tracking-wider">Stay Details</h4>
            <Input
              label="Accommodation Name"
              value={formData.stayDetails?.name || ""}
              onChange={(e) => setFormData({ ...formData, stayDetails: { ...formData.stayDetails, name: e.target.value } })}
              placeholder="e.g. ISKCON Temple Guest House"
            />
            <Input
              label="Address"
              value={formData.stayDetails?.address || ""}
              onChange={(e) => setFormData({ ...formData, stayDetails: { ...formData.stayDetails, address: e.target.value } })}
              placeholder="Full address of hotel/guest house"
            />
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-[#fcfaf5] border border-[#e5d9c3]">
            <h4 className="text-xs font-bold text-[#174824] uppercase tracking-wider">Local Coordinator</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Coordinator Name"
                value={formData.localContacts?.[0]?.name || ""}
                onChange={(e) => setFormData({ ...formData, localContacts: [{ role: "COORDINATOR", name: e.target.value, phone: formData.localContacts?.[0]?.phone || "" }] })}
                placeholder="Local Coordinator Name"
              />
              <Input
                label="Coordinator Phone"
                value={formData.localContacts?.[0]?.phone || ""}
                onChange={(e) => setFormData({ ...formData, localContacts: [{ role: "COORDINATOR", name: formData.localContacts?.[0]?.name || "", phone: e.target.value }] })}
                placeholder="+91 Phone number"
              />
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Attachments */}
      {currentStep === 4 && (
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <h3 className="text-lg font-bold text-[#174824]">
            Step 4: Attachments & Documents
          </h3>
          <p className="text-xs text-[#5a4836]">
            Upload flight tickets, invitation letters, hotel bookings, or itinerary documents.
          </p>

          <Input
            label="Ticket / Document File URL"
            placeholder="https://drive.google.com/ticket-file.pdf"
            onChange={(e) => {
              if (e.target.value) {
                setFormData({
                  ...formData,
                  attachments: [{ category: "TICKET", title: "Flight Ticket", fileUrl: e.target.value }],
                });
              }
            }}
          />
        </Card>
      )}

      {/* STEP 5: Contextual Expense Entry */}
      {currentStep === 5 && (
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#174824]">
              Step 5: Contextual Travel Expenses
            </h3>
            <Button type="button" onClick={addExpense} variant="outline" className="rounded-xl text-xs border-[#cfa35d]">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Expense
            </Button>
          </div>

          {formData.expenses?.length === 0 ? (
            <p className="text-xs text-[#5a4836]">No initial expenses added. You can add expenses anytime later.</p>
          ) : (
            formData.expenses?.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3] flex items-center justify-between gap-3 text-xs">
                <Input
                  label="Title"
                  value={exp.title}
                  onChange={(e) => {
                    const updated = [...(formData.expenses || [])];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, expenses: updated });
                  }}
                />
                <Input
                  type="number"
                  label="Amount (₹)"
                  value={exp.amount}
                  onChange={(e) => {
                    const updated = [...(formData.expenses || [])];
                    updated[idx].amount = Number(e.target.value);
                    setFormData({ ...formData, expenses: updated });
                  }}
                />
                <button type="button" onClick={() => removeExpense(idx)} className="text-red-700 mt-5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </Card>
      )}

      {/* STEP 6: Review & Final Validation */}
      {currentStep === 6 && (
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <h3 className="text-lg font-bold text-[#174824]">
            Step 6: Review & Final Validation
          </h3>

          <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-[#e5d9c3] space-y-2 text-xs">
            <p className="font-bold text-[#174824] text-sm">{formData.title}</p>
            <p className="text-[#5a4836]">Route: {formData.fromLocation} → {formData.destinationCity}</p>
            <p className="text-[#5a4836]">Dates: {formData.startDate} to {formData.endDate}</p>
            <p className="text-[#5a4836]">Accommodation: {formData.stayDetails?.name || "Temple Guest House"}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5a4836]">Special Instructions / Notes</label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-xl border border-[#cfa35d] bg-white text-xs"
              placeholder="Any special diet, prasadam, or travel notes..."
            />
          </div>
        </Card>
      )}

      {/* Navigation Buttons Row */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          variant="outline"
          className="rounded-xl border-[#e5d9c3]"
        >
          Previous
        </Button>

        {currentStep < 6 ? (
          <Button onClick={handleNextStep} className="bg-[#174824] text-white rounded-xl">
            Next Step
          </Button>
        ) : (
          <Button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Travel Entry</span>
          </Button>
        )}
      </div>
    </>
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
