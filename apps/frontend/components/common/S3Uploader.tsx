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
  ExternalLink,
  Trash2,
} from "lucide-react";
import { uploadFileToS3 } from "@/lib/s3-uploader";
import { UploadProgress } from "@/types/media";

export interface S3FileItem {
  title?: string;
  name?: string;
  fileUrl?: string;
  url?: string;
  fileType?: string;
  key?: string;
  category?: string;
}

export interface S3UploaderProps {
  /** Target S3 folder/prefix, e.g. "avatars", "travel/attachments", "documents" */
  folder?: string;
  /** Accepted file types (e.g. "image/*,application/pdf") */
  accept?: string;
  /** Maximum file size in Megabytes (default: 10MB) */
  maxSizeMB?: number;
  /** Maximum number of files allowed (for multi-file mode) */
  maxFiles?: number;
  /** Currently selected/uploaded S3 key or URL (single file mode) */
  value?: string;
  /** List of files (for multi-file uploader or viewOnly list) */
  files?: S3FileItem[];
  /** Callback returning the uploaded S3 Key and Public URL */
  onUploadSuccess?: (key: string, publicUrl: string) => void;
  /** Optional callback on upload failure */
  onUploadError?: (error: Error) => void;
  /** Optional callback on remove / clear (single file mode) */
  onRemove?: () => void;
  /** Optional callback when a file is removed from files list */
  onRemoveFile?: (index: number) => void;
  /** Custom label */
  label?: string;
  /** Compact mode for smaller avatar or button inputs */
  variant?: "dropzone" | "compact" | "avatar";
  /** Optional class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** View-only mode: renders files without upload controls or delete buttons */
  viewOnly?: boolean;
  /** Alias for viewOnly */
  readOnly?: boolean;
  /** Empty state message for viewOnly mode */
  emptyText?: string;
}

const getFileUrl = (item: S3FileItem | string): string => {
  if (typeof item === "string") return item;
  return item.fileUrl || item.url || "";
};

const getFileName = (item: S3FileItem | string): string => {
  if (typeof item === "string") {
    const raw = item.split("/").pop() || "Document";
    const parts = raw.split("_");
    return parts.length > 3 ? parts.slice(3).join("_") : raw;
  }
  if (item.title) return item.title;
  if (item.name) return item.name;
  if (item.key) {
    const raw = item.key.split("/").pop() || "Document";
    const parts = raw.split("_");
    return parts.length > 3 ? parts.slice(3).join("_") : raw;
  }
  return "Document";
};

const getFileType = (item: S3FileItem | string, url: string): string => {
  if (typeof item !== "string" && item.fileType) return item.fileType;
  const ext = url.split(".").pop()?.split("?")[0]?.toLowerCase();
  return ext || "file";
};

const isImageFile = (url: string): boolean => {
  return /\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i.test(url);
};

export default function S3Uploader({
  folder = "uploads",
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
  maxFiles,
  value,
  files,
  onUploadSuccess,
  onUploadError,
  onRemove,
  onRemoveFile,
  label,
  variant = "dropzone",
  className = "",
  disabled = false,
  viewOnly = false,
  readOnly = false,
  emptyText = "No documents attached",
}: S3UploaderProps) {
  const isViewMode = viewOnly || readOnly;
  const effectiveFiles: S3FileItem[] =
    files && files.length > 0
      ? files
      : value
      ? [{ fileUrl: value, title: getFileName(value) }]
      : [];

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── 1. VIEW ONLY / READ ONLY MODE ───
  if (isViewMode) {
    if (effectiveFiles.length === 0) {
      return (
        <p className={`text-xs text-[#8c7865] italic ${className}`}>
          {emptyText}
        </p>
      );
    }

    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 w-full ${className}`}>
        {effectiveFiles.map((item, index) => {
          const url = getFileUrl(item);
          const name = getFileName(item);
          const type = getFileType(item, url);
          const img = isImageFile(url);

          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Click to open ${name}`}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-[#faf5eb] hover:bg-[#f2e8d7] border border-[#e5d9c3] hover:border-[#c2b097] transition-all group cursor-pointer shadow-2xs"
            >
              {img ? (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#e5d9c3] flex-shrink-0 bg-stone-100">
                  <Image
                    src={url}
                    alt={name}
                    fill
                    sizes="36px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 group-hover:text-[#174824] transition-colors">
                  <FileText className="w-4.5 h-4.5" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#2c221e] group-hover:text-[#174824] truncate transition-colors">
                  {name}
                </p>
                <p className="text-[10px] text-[#8c7865] font-medium uppercase">
                  .{type}
                </p>
              </div>

              <ExternalLink className="w-3.5 h-3.5 text-[#8c7865] group-hover:text-[#174824] opacity-50 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
            </a>
          );
        })}
      </div>
    );
  }

  // ─── FILE UPLOAD HANDLER ───
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
      onUploadSuccess?.(result.key, result.publicUrl);

      // If in multi-file mode (files array provided), clear single preview so dropzone resets for next file
      if (files) {
        setPreviewUrl(null);
        setUploadedFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err: any) {
      const errObj =
        err instanceof Error ? err : new Error(err?.message || "Upload failed");
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
          onClick={() =>
            !disabled && !isUploading && fileInputRef.current?.click()
          }
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
              sizes="96px"
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

        {label && (
          <p className="text-xs font-semibold text-[#2c221e]">{label}</p>
        )}
        {errorMessage && (
          <p className="text-[11px] text-red-600 font-medium">{errorMessage}</p>
        )}
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
            <span className="truncate max-w-[150px]">
              {uploadedFileName || "File Uploaded"}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[#8c7865] hover:text-red-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
        )}
      </div>
    );
  }

  // ─── FULL DROPZONE VARIANT (DEFAULT) ───
  const hasReachedLimit = Boolean(maxFiles && files && files.length >= maxFiles);

  return (
    <div className={`space-y-3 ${className}`}>
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

      {/* Uploader Box — hidden when maxFiles limit reached */}
      {!hasReachedLimit ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            !disabled && !isUploading && fileInputRef.current?.click()
          }
          className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center transition-all cursor-pointer select-none overflow-hidden ${
            isDragging
              ? "border-[#174824] bg-[#174824]/10 scale-[1.01]"
              : previewUrl && !files
              ? "border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70"
              : "border-[#e5d9c3] bg-[#faf4e8]/60 hover:bg-[#faf4e8] hover:border-[#174824]/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {/* Upload in progress overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#174824] mb-2" />
              <p className="text-xs font-bold text-[#174824]">
                Uploading to Secure S3 Storage...
              </p>
              <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#174824] transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-[#5a4836] font-semibold mt-1">
                {progress}%
              </span>
            </div>
          )}

          {/* Single-file uploaded preview (when not in multi-file mode) */}
          {previewUrl && !isUploading && !files ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {isImageFile(previewUrl) || previewUrl.startsWith("blob:") ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-200 flex-shrink-0 bg-white shadow-2xs">
                    <Image
                      src={previewUrl}
                      alt="Upload Preview"
                      fill
                      sizes="48px"
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
            /* Prompt State */
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center text-[#174824] mb-2 shadow-2xs">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-xs font-bold text-[#174824]">
                Click to upload{" "}
                <span className="font-normal text-[#5a4836]">or drag and drop</span>
              </p>
              <p className="text-[10px] text-[#8c7865] mt-1">
                Supports Images & PDFs (Up to {maxSizeMB}MB
                {maxFiles ? `, max ${maxFiles} files` : ""})
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Limit Reached Notification Banner */
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-semibold text-emerald-800">
            Maximum {maxFiles} attachments reached. Remove a file to upload more.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ─── MULTI-FILE LIST (If files array is passed in edit mode) ─── */}
      {files && files.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
            {files.length} File{files.length !== 1 ? "s" : ""} Attached
          </p>

          <div className="space-y-2">
            {files.map((att, index) => {
              const url = getFileUrl(att);
              const name = getFileName(att);
              const type = getFileType(att, url);
              const img = isImageFile(url);

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl border border-[#e5d9c3] bg-white hover:bg-[#faf5eb]/50 transition-colors group"
                >
                  {/* Thumbnail / Icon (Click to open) */}
                  {img ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Click to view ${name}`}
                      className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#e5d9c3] flex-shrink-0 bg-gray-50 hover:opacity-85 transition-opacity cursor-pointer block"
                    >
                      <Image
                        src={url}
                        alt={name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </a>
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Click to open ${name}`}
                      className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 hover:bg-amber-100/70 transition-colors cursor-pointer text-amber-800"
                    >
                      <FileText className="w-4.5 h-4.5" />
                    </a>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#2c221e] hover:text-[#174824] hover:underline truncate block cursor-pointer"
                      title={`Click to open ${name}`}
                    >
                      {name}
                    </a>
                    <p className="text-[10px] text-[#8c7865] font-medium uppercase">
                      .{type}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#174824] hover:underline cursor-pointer"
                    >
                      <span>View</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                    {onRemoveFile && (
                      <button
                        type="button"
                        onClick={() => onRemoveFile(index)}
                        className="p-1 rounded-lg text-[#8c7865] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
