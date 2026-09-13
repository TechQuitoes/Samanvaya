"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { KeyRound, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import EPasswordInput from "@/components/common/EPasswordInput";

interface TargetUser {
  _id: string;
  name: string;
  email?: string;
}

interface ResetPasswordModalProps {
  user: TargetUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ResetPasswordModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetState = () => {
    setNewPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    handleResetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiNexus.call<{ message: string }>(
        "PATCH_ADMIN_RESET_PASSWORD",
        {
          params: { id: user._id },
          payload: { newPassword },
        }
      );

      if (res.isSuccess) {
        toast.success(
          res.data?.message || `Password reset successfully for ${user.name}!`
        );
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || "Failed to reset password.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while resetting password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : null)}>
      <DialogContent className="bg-[#fffdfa] border-[#e5d9c3] rounded-[24px] max-w-sm p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-bold text-[#174824] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#174824]/10 flex items-center justify-center text-[#174824]">
              <KeyRound className="w-4 h-4" />
            </div>
            <span>Reset User Password</span>
          </DialogTitle>
          <DialogDescription className="text-[11px] text-[#8c7865] font-medium">
            Set a new password for this user account.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#faf4e8] border border-[#e5d9c3]/70 my-1">
            <div className="w-7 h-7 rounded-full bg-[#174824]/10 flex items-center justify-center flex-shrink-0 text-[#174824]">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#2c221e] truncate">{user.name}</p>
              {user.email && (
                <p className="text-[11px] text-[#5a4836] truncate">{user.email}</p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1">
          <EPasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 chars)"
            autoFocus
            required
          />

          <EPasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />

          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <p className="text-[11px] text-red-600 font-semibold">
              Passwords do not match
            </p>
          )}

          <div className="flex items-center gap-2.5 pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-xl border border-[#e5d9c3] bg-[#faf5eb] hover:bg-[#f3ead8] text-xs font-bold text-[#5a4836] transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !newPassword.trim() ||
                !confirmPassword.trim() ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
              className="flex-1 h-10 rounded-xl bg-[#174824] hover:bg-[#12381c] disabled:bg-[#174824]/40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
