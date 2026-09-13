"use client";

import React from "react";
import { Check } from "lucide-react";
import useTravelWizard from "@/hooks/travel/useTravelWizard";

// Modular Step Components
import Step1BasicDetails from "./wizard/Step1BasicDetails";
import Step2Transport from "./wizard/Step2Transport";
import Step3StayAndContacts from "./wizard/Step3StayAndContacts";
import Step4Attachments from "./wizard/Step4Attachments";
import Step5ReviewAndSubmit from "./wizard/Step5ReviewAndSubmit";

interface TravelWizardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STEPS_LIST = [
  { num: 1, label: "Basic", title: "Basic Details" },
  { num: 2, label: "Transport", title: "Transport Details" },
  { num: 3, label: "Stay & Contacts", title: "Stay & Contacts" },
  { num: 4, label: "Attachments", title: "Attachments" },
  { num: 5, label: "Review", title: "Review & Notes" },
];

export default function TravelWizardForm({
  onSuccess,
}: TravelWizardFormProps) {
  const {
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
  } = useTravelWizard({ onSuccess });

  return (
    <div ref={formTopRef} className="space-y-5">
      {/* ─── 4-STEP NUMBERED STEPPER ─── */}
      <div className="bg-[#fbf8f2] border border-[#e5d9c3] rounded-2xl p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-4 h-[2px] bg-[#e5d9c3] -z-0" />

          {STEPS_LIST.map((step) => {
            const isActive = step.num === currentStep;
            const isCompleted = step.num < currentStep;

            return (
              <div
                key={step.num}
                onClick={() => {
                  if (
                    step.num < currentStep ||
                    (currentStep === 1 && formData.title.trim())
                  ) {
                    setCurrentStep(step.num);
                  }
                }}
                className="flex flex-col items-center gap-1.5 z-10 cursor-pointer select-none"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                    isActive
                      ? "bg-[#174824] text-white ring-4 ring-[#174824]/20 scale-110"
                      : isCompleted
                      ? "bg-[#174824] text-white"
                      : "bg-[#fbf7f0] border border-[#cfa35d] text-[#5a4836]"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span
                  className={`text-[9px] sm:text-[11px] font-bold tracking-tight text-center ${
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

      {/* STEP 1: BASIC DETAILS */}
      {currentStep === 1 && (
        <Step1BasicDetails
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextStep}
        />
      )}

      {/* STEP 2: TRANSPORT DETAILS */}
      {currentStep === 2 && (
        <Step2Transport
          transport={transport}
          setTransport={setTransport}
          formData={formData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* STEP 3: STAY & CONTACTS */}
      {currentStep === 3 && (
        <Step3StayAndContacts
          formData={formData}
          setFormData={setFormData}
          editingContactIndex={editingContactIndex}
          setEditingContactIndex={setEditingContactIndex}
          removeContactPerson={removeContactPerson}
          updateContactPerson={updateContactPerson}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* STEP 4: ATTACHMENTS */}
      {currentStep === 4 && (
        <Step4Attachments
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* STEP 5: REVIEW & SUBMIT */}
      {currentStep === 5 && (
        <Step5ReviewAndSubmit
          formData={formData}
          setFormData={setFormData}
          transport={transport}
          isSubmitting={isSubmitting}
          onPrev={handlePrevStep}
          onSubmit={handleFinalSubmit}
          onJumpToStep={setCurrentStep}
        />
      )}
    </div>
  );
}
