"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { uploadFileToS3 } from "@/lib/s3-uploader";
import { UploadProgress } from "@/types/media";

export interface S3UploaderProps {
  /** Target S3 folder/prefix, e.g. "avatars", "travel/receipts", "documents" */
  folder?: string;
  /** Accepted file types (e.g. "image/*,application/pdf") */
  accept?: string;
  /** Maximum file size in Megabytes (default: 10MB) */
  maxSizeMB?: number;
  /** Currently selected/uploaded S3 key or URL (for preview or initial value) */
  value?: string;
  /** Callback returning the uploaded S3 Key and Public URL */
  onUploadSuccess: (key: string, publicUrl: string) => void;
  /** Optional callback on upload failure */
  onUploadError?: (error: Error) => void;
  /** Optional callback on remove / clear */
  onRemove?: () => void;
  /** Custom label */
  label?: string;
  /** Compact mode for smaller avatar or button inputs */
  variant?: "dropzone" | "compact" | "avatar";
  /** Optional class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export default function S3Uploader({
  folder = "uploads",
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
  value,
  onUploadSuccess,
  onUploadError,
  onRemove,
  label,
  variant = "dropzone",
  className = "",
  disabled = false,
}: S3UploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const err = `File size exceeds ${maxSizeMB}MB limit.`;
      setErrorMessage(err);
      onUploadError?.(new Error(err));
      return;
    }

    // Set local preview if it's an image
    if (file.type.startsWith("image/")) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }
    setUploadedFileName(file.name);

    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadFileToS3(file, {
        folder,
        onProgress: (p: UploadProgress) => setProgress(p.percent),
      });

      setPreviewUrl(result.publicUrl);
      onUploadSuccess(result.key, result.publicUrl);
    } catch (err: any) {
      const errObj = err instanceof Error ? err : new Error(err?.message || "Upload failed");
      setErrorMessage(errObj.message);
      onUploadError?.(errObj);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setUploadedFileName(null);
    setErrorMessage(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemove?.();
  };

  // ─── AVATAR VARIANT ───
  if (variant === "avatar") {
    return (
      <div className={`relative flex flex-col items-center gap-2 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={disabled || isUploading}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-dashed transition-all flex items-center justify-center cursor-pointer select-none ${
            isDragging
              ? "border-[#174824] bg-[#174824]/10 scale-105"
              : previewUrl
              ? "border-[#174824] bg-white"
              : "border-[#e5d9c3] bg-[#faf4e8] hover:border-[#174824]/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2">
              <UploadCloud className="w-6 h-6 text-[#174824]/70 mb-1" />
              <span className="text-[10px] font-bold text-[#174824]">Upload</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-1">
              <Loader2 className="w-5 h-5 animate-spin text-amber-300 mb-1" />
              <span className="text-[10px] font-bold">{progress}%</span>
            </div>
          )}
        </div>

        {label && <p className="text-xs font-semibold text-[#2c221e]">{label}</p>}
        {errorMessage && <p className="text-[11px] text-red-600 font-medium">{errorMessage}</p>}
      </div>
    );
  }

  // ─── COMPACT BUTTON VARIANT ───
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={disabled || isUploading}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className={`h-9 px-3.5 rounded-xl border border-[#e5d9c3] bg-[#faf4e8] hover:bg-[#174824] hover:text-white text-[#174824] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Uploading {progress}%</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{label || "Upload File"}</span>
            </>
          )}
        </button>

        {previewUrl && (
          <div className="flex items-center gap-2 text-xs font-medium text-[#174824] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate max-w-[150px]">{uploadedFileName || "File Uploaded"}</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[#8c7865] hover:text-red-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {errorMessage && <p className="text-xs text-red-600 font-medium">{errorMessage}</p>}
      </div>
    );
  }

  // ─── FULL DROPZONE VARIANT (DEFAULT) ───
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#2c221e] uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        disabled={disabled || isUploading}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center transition-all cursor-pointer select-none overflow-hidden ${
          isDragging
            ? "border-[#174824] bg-[#174824]/10 scale-[1.01]"
            : previewUrl
            ? "border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70"
            : "border-[#e5d9c3] bg-[#faf4e8]/60 hover:bg-[#faf4e8] hover:border-[#174824]/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {/* Upload in progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#174824] mb-2" />
            <p className="text-xs font-bold text-[#174824]">Uploading to Secure S3 Storage...</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#174824] transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[#5a4836] font-semibold mt-1">{progress}%</span>
          </div>
        )}

        {/* Uploaded State Preview */}
        {previewUrl && !isUploading ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {previewUrl.match(/\.(jpeg|jpg|png|webp|gif)/i) || previewUrl.startsWith("blob:") ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-200 flex-shrink-0 bg-white shadow-2xs">
                  <Image
                    src={previewUrl}
                    alt="Upload Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#174824]/10 flex items-center justify-center flex-shrink-0 text-[#174824]">
                  <FileText className="w-6 h-6" />
                </div>
              )}

              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-[#174824] truncate">
                    {uploadedFileName || "File Uploaded Successfully"}
                  </p>
                </div>
                <p className="text-[10px] text-[#8c7865] font-medium">Ready to save</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-1.5 rounded-lg text-[#174824] hover:bg-[#174824]/10 transition-colors cursor-pointer"
                title="Change File"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remove File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Prompt State */
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center text-[#174824] mb-2 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            <p className="text-xs font-bold text-[#174824]">
              Click to upload <span className="font-normal text-[#5a4836]">or drag and drop</span>
            </p>
            <p className="text-[10px] text-[#8c7865] mt-1">
              Supports Images & PDFs (Up to {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
