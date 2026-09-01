"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFileToS3 } from "@/lib/s3-uploader";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import DataManager from "@/lib/data-manager";
import { User } from "@/types/auth";

interface SacredAvatarUploadProps {
  avatarUrl?: string;
  userName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onAvatarUpdated?: (newUrl: string, s3Key: string) => void;
  folder?: string;
}

export default function SacredAvatarUpload({
  avatarUrl,
  userName = "Devotee",
  size = "lg",
  editable = true,
  onAvatarUpdated,
  folder = "avatars",
}: SacredAvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(avatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Sync state if prop changes externally
  if (avatarUrl !== undefined && avatarUrl !== currentUrl && !isUploading) {
    setCurrentUrl(avatarUrl);
  }

  const sizeClasses = {
    sm: "w-12 h-12 text-base",
    md: "w-16 h-16 text-xl",
    lg: "w-20 h-20 text-2xl",
    xl: "w-28 h-28 text-3xl",
  }[size];

  const cameraBadgeSizes = {
    sm: "w-4 h-4 p-0.5 right-0 bottom-0",
    md: "w-6 h-6 p-1 right-0 bottom-0",
    lg: "w-7 h-7 p-1.5 right-0 bottom-0",
    xl: "w-8 h-8 p-1.5 right-1 bottom-1",
  }[size];

  const handleContainerClick = () => {
    if (!editable || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = "";

    // 1. Validate MIME type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // 2. Validate max size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be under 5 MB.");
      return;
    }

    // 3. Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setCurrentUrl(previewUrl);
    setIsUploading(true);
    setUploadPercent(0);

    try {
      // 4. Upload directly to Cloudflare R2 / AWS S3 using presigned URL
      const { key, publicUrl } = await uploadFileToS3(file, {
        folder,
        onProgress: (prog) => {
          setUploadPercent(prog.percent);
        },
      });

      // 5. Save avatar URL in MongoDB via PATCH /auth/profile
      const res = await apiNexus.call<User>("PATCH_PROFILE", {
        payload: { avatar: publicUrl },
      });

      if (res.isSuccess && res.data) {
        DataManager.setUser(res.data);
      } else {
        // Optimistic local storage update
        const currentUser = DataManager.getUser();
        if (currentUser) {
          DataManager.setUser({ ...currentUser, avatar: publicUrl });
        }
      }

      setCurrentUrl(publicUrl);
      onAvatarUpdated?.(publicUrl, key);
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      toast.error(err.message || "Failed to upload avatar image.");
      // Revert preview on failure
      setCurrentUrl(avatarUrl);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : "D";

  return (
    <div className="relative inline-block select-none">
      {/* Hidden File Input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      )}

      {/* Avatar Container */}
      <div
        onClick={handleContainerClick}
        className={`relative ${sizeClasses} rounded-full border-[3px] border-[#d4af37] bg-white shadow-md flex items-center justify-center overflow-hidden font-bold text-[#174824] ${
          editable ? "cursor-pointer group hover:ring-2 hover:ring-[#174824]/40" : ""
        } transition-all`}
        title={editable ? "Click to change profile picture" : userName}
      >
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={userName}
            fill
            sizes="112px"
            className="object-cover object-center"
          />
        ) : (
          <span>{initial}</span>
        )}

        {/* Uploading Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white z-10">
            <Loader2 className="w-5 h-5 animate-spin text-amber-300 mb-0.5" />
            <span className="text-[9px] font-bold">{uploadPercent}%</span>
          </div>
        )}

        {/* Hover Camera Overlay on Desktop */}
        {editable && !isUploading && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-10">
            <Camera className="w-5 h-5 drop-shadow" />
          </div>
        )}
      </div>

      {/* Small Camera Badge Icon on bottom corner */}
      {editable && !isUploading && (
        <button
          type="button"
          onClick={handleContainerClick}
          className={`absolute ${cameraBadgeSizes} rounded-full bg-[#174824] text-white border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#12381c] transition-transform active:scale-90 z-20`}
          title="Change profile picture"
          aria-label="Upload photo"
        >
          <Camera className="w-full h-full text-amber-300" />
        </button>
      )}
    </div>
  );
}
