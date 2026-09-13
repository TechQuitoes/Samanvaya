"use client";

import React from "react";
import {
  Building,
  User,
  Plus,
  Trash2,
  Edit3,
  Check,
  ArrowRight,
} from "lucide-react";
import ECard from "@/components/common/ECard";
import EButton from "@/components/common/EButton";
import EInput from "@/components/common/EInput";
import EMobileInput from "@/components/common/EMobileInput";
import EEmailInput from "@/components/common/EEmailInput";
import ESelect from "@/components/common/ESelect";
import EDateTimePicker from "@/components/common/EDateTimePicker";
import {
  AccommodationType,
  CreateTravelPayload,
  LocalContact,
} from "@/types/travel";
import { STAY_TYPE_OPTIONS } from "./constants";

interface Step3StayAndContactsProps {
  formData: CreateTravelPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateTravelPayload>>;
  editingContactIndex: number | null;
  setEditingContactIndex: React.Dispatch<React.SetStateAction<number | null>>;
  removeContactPerson: (index: number) => void;
  updateContactPerson: (index: number, fields: Partial<LocalContact>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3StayAndContacts({
  formData,
  setFormData,
  editingContactIndex,
  setEditingContactIndex,
  removeContactPerson,
  updateContactPerson,
  onNext,
  onPrev,
}: Step3StayAndContactsProps) {
  return (
    <ECard className="p-4 sm:p-6 space-y-4">
      <div className="border-b border-[#e5d9c3]/70 pb-2.5 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-[#174824] flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-700" />
          <span>Step 3: Stay & Contacts</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold">
          Step 3 of 4
        </span>
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
                stayDetails: {
                  ...formData.stayDetails,
                  bookingRef: e.target.value,
                },
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
              <span>
                Contact Persons ({formData.localContacts?.length || 0})
              </span>
            </span>
          </div>
          <EButton
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
            leftIcon={<Plus className="w-3 h-3" />}
          >
            Add Person
          </EButton>
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
                  <span className="text-xs font-bold text-[#174824]">
                    Contact #{idx + 1}
                  </span>
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
                    onChange={(e) =>
                      updateContactPerson(idx, { name: e.target.value })
                    }
                    placeholder="e.g. Madhav Das"
                    required
                  />
                  <EInput
                    label="Role / Title"
                    value={contact.role}
                    onChange={(e) =>
                      updateContactPerson(idx, { role: e.target.value })
                    }
                    placeholder="e.g. Temple President, Coordinator"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <EMobileInput
                    label="Phone Number"
                    value={contact.phone}
                    onChange={(e) =>
                      updateContactPerson(idx, { phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    required
                  />
                  <EEmailInput
                    label="Email"
                    value={contact.email || ""}
                    onChange={(e) =>
                      updateContactPerson(idx, { email: e.target.value })
                    }
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
                  {contact.name?.trim()
                    ? contact.name.charAt(0).toUpperCase()
                    : idx + 1}
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
          Next: Review & Itinerary
        </EButton>
      </div>
    </ECard>
  );
}
