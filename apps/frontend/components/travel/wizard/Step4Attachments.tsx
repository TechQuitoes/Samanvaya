"use client";

import React from "react";
import { Paperclip, ChevronRight, ChevronLeft } from "lucide-react";
import ECard from "@/components/common/ECard";
import EButton from "@/components/common/EButton";
import S3Uploader from "@/components/common/S3Uploader";
import { CreateTravelPayload, TravelAttachment } from "@/types/travel";

const MAX_ATTACHMENTS = 5;

interface Step4AttachmentsProps {
  formData: CreateTravelPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateTravelPayload>>;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4Attachments({
  formData,
  setFormData,
  onNext,
  onPrev,
}: Step4AttachmentsProps) {
  const attachments = formData.attachments || [];

  const handleUploadSuccess = (key: string, publicUrl: string) => {
    const fileName =
      key.split("/").pop()?.split("_").slice(3).join("_") || "file";
    const attachment: TravelAttachment = {
      category: "DOCUMENT",
      title: fileName,
      fileUrl: publicUrl,
      fileType: key.split(".").pop() || "file",
      key,
    };

    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), attachment],
    }));
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <ECard className="p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#174824]/10 border border-[#174824]/20 text-[#174824] flex items-center justify-center">
              <Paperclip className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#174824] font-serif-display">
                Attachments
              </h2>
              <p className="text-[10px] sm:text-[11px] text-[#8c7865] font-medium">
                Upload tickets, bookings, ID proofs, or travel documents (optional)
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-[#8c7865] bg-[#faf5eb] border border-[#e5d9c3] px-2 py-0.5 rounded-lg flex-shrink-0">
            {attachments.length}/{MAX_ATTACHMENTS}
          </span>
        </div>

        {/* Unified S3Uploader: Dropzone + Limit management + File list with preview & click-to-open */}
        <S3Uploader
          folder="travel/attachments"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          maxSizeMB={15}
          maxFiles={MAX_ATTACHMENTS}
          files={attachments}
          onUploadSuccess={handleUploadSuccess}
          onRemoveFile={handleRemoveAttachment}
          onUploadError={(err) =>
            console.error("Attachment upload failed:", err)
          }
        />
      </ECard>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        <EButton
          type="button"
          onClick={onPrev}
          variant="outline"
          size="md"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </EButton>
        <EButton
          type="button"
          onClick={onNext}
          variant="sacred-primary"
          size="md"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="flex-1"
        >
          Continue to Review
        </EButton>
      </div>
    </div>
  );
}
