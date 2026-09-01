"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Save,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import SacredAvatarUpload from "@/components/common/SacredAvatarUpload";
import DataManager from "@/lib/data-manager";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { User } from "@/types/auth";

interface ProfileField {
  key: string;
  label: string;
  value: string;
  displayValue?: string;
  editable: boolean;
  type?: string;
  placeholder?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<ProfileField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Change Password Modal
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isPwSaving, setIsPwSaving] = useState(false);

  useEffect(() => {
    const cachedUser = DataManager.getUser();
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
    }

    apiNexus
      .call<User>("GET_PROFILE")
      .then((res) => {
        if (res.isSuccess && res.data) {
          setUser(res.data);
          DataManager.setUser(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openEditModal = (field: ProfileField) => {
    setEditingField(field);
    setEditValue(field.value);
    setEditModalOpen(true);
  };

  const handleSaveField = async () => {
    if (!editingField || !user) return;
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        [editingField.key]: editValue.trim(),
      };
      const res = await apiNexus.call<User>("PATCH_PROFILE", { payload });
      if (res.isSuccess && res.data) {
        const updatedUser = { ...user, ...res.data };
        setUser(updatedUser);
        DataManager.setUser(updatedUser);
        toast.success(`${editingField.label} updated successfully!`);
      } else {
        const updatedUser = { ...user, [editingField.key]: editValue.trim() };
        setUser(updatedUser);
        DataManager.setUser(updatedUser);
        toast.success(`${editingField.label} saved!`);
      }
    } catch {
      const updatedUser = { ...user, [editingField.key]: editValue.trim() };
      setUser(updatedUser);
      DataManager.setUser(updatedUser);
      toast.success(`${editingField.label} saved locally!`);
    } finally {
      setIsSaving(false);
      setEditModalOpen(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsPwSaving(true);
    try {
      const res = await apiNexus.call("PATCH_CHANGE_PASSWORD", {
        payload: { newPassword, confirmPassword },
      });
      if (res.isSuccess) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(res.message || "Failed to change password.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password.");
    } finally {
      setIsPwSaving(false);
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPw(false);
      setShowConfirmPw(false);
      setPwModalOpen(false);
    }
  };

  const getTempleDisplay = () => {
    if (user?.templeName) return user.templeName;
    if (user?.temple && typeof user.temple === "object" && user.temple.name) {
      return user.temple.name;
    }
    return "";
  };

  const getProfileFields = (): ProfileField[] => {
    if (!user) return [];
    return [
      {
        key: "name",
        label: "Full Name",
        value: user.name || "",
        displayValue: user.name || "—",
        editable: true,
        placeholder: "Enter full name",
      },
      {
        key: "email",
        label: "Email Address",
        value: user.email || "",
        displayValue: user.email || "—",
        editable: false,
      },
      {
        key: "mobile",
        label: "Mobile",
        value: user.mobile || "",
        displayValue: user.mobile || "Not specified",
        editable: true,
        type: "tel",
        placeholder: "e.g. +91 9876543210",
      },
      {
        key: "templeName",
        label: "Temple / Ashram",
        value: getTempleDisplay(),
        displayValue: getTempleDisplay() || "Not specified",
        editable: true,
        placeholder: "e.g. ISKCON Mumbai, ISKCON Vrindavan",
      },
      {
        key: "city",
        label: "City",
        value: user.city || "",
        displayValue: user.city || "Not specified",
        editable: true,
        placeholder: "e.g. Mumbai, Ahmedabad, Mayapur",
      },
      {
        key: "country",
        label: "Country",
        value: user.country || "",
        displayValue: user.country || "Not specified",
        editable: true,
        placeholder: "e.g. India, United States, United Kingdom",
      },
      {
        key: "role",
        label: "Role",
        value: user.role || "—",
        displayValue: user.role || "—",
        editable: false,
      },
      {
        key: "status",
        label: "Account Status",
        value: user.status || "APPROVED",
        displayValue: user.status || "APPROVED",
        editable: false,
      },
      {
        key: "createdAt",
        label: "Member Since",
        value: formatDate(user.createdAt),
        displayValue: formatDate(user.createdAt),
        editable: false,
      },
    ];
  };

  return (
    <SacredPortalLayout>
      <div className="max-w-lg mx-auto space-y-5 pb-10">
        {/* Back Nav */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174824] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* PROFILE CARD */}
        {isLoading || !user ? (
          <div className="p-6 rounded-3xl bg-[#faf4e8] border border-[#e5d9c3] space-y-4 animate-pulse">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="w-20 h-20 rounded-full bg-[#e5d9c3]/60" />
              <Skeleton className="h-5 w-32 bg-[#e5d9c3]/60" />
            </div>
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl bg-[#e5d9c3]/40" />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-[#faf4e8] border border-[#e5d9c3] overflow-hidden shadow-2xs">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-[#e5d9c3]/60">
              <SacredAvatarUpload
                avatarUrl={user.avatar}
                userName={user.name}
                size="lg"
                editable={true}
                onAvatarUpdated={(newUrl) => {
                  setUser((prev) => (prev ? { ...prev, avatar: newUrl } : prev));
                }}
              />

              <h2 className="mt-3 text-lg font-bold text-[#174824]">
                {user.name}
              </h2>

              <span className="mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300">
                {user.role}
              </span>
            </div>

            {/* Field Rows */}
            <div className="divide-y divide-[#e5d9c3]/50">
              {getProfileFields().map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between px-6 py-3.5 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-[#8c7865] uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="text-sm font-semibold text-[#2c221e] mt-0.5 truncate">
                      {field.key === "status" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {field.displayValue}
                        </span>
                      ) : (
                        field.displayValue
                      )}
                    </p>
                  </div>

                  {field.editable && (
                    <button
                      type="button"
                      onClick={() => openEditModal(field)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#174824]/10 hover:bg-[#174824]/20 text-[#174824] transition-colors cursor-pointer flex-shrink-0"
                      aria-label={`Edit ${field.label}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Change Password */}
            <div className="px-6 py-5 border-t border-[#e5d9c3]/60">
              <button
                type="button"
                onClick={() => setPwModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#174824] hover:bg-[#12381c] text-white text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-[0.99]"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── EDIT FIELD MODAL ─── */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-[#fffdfa] border-[#e5d9c3] rounded-[24px] max-w-sm p-6 shadow-xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-[#174824]">
              Edit {editingField?.label}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-[#8c7865] font-medium">
              Update your {editingField?.label.toLowerCase()} and save
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              label={editingField?.label}
              type={editingField?.type || "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={editingField?.placeholder || `Enter ${editingField?.label.toLowerCase()}`}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="flex-1 h-11 rounded-xl border border-[#e5d9c3] bg-[#faf5eb] hover:bg-[#f3ead8] text-xs font-bold text-[#5a4836] transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveField}
              disabled={isSaving || editValue.trim() === editingField?.value}
              className="flex-1 h-11 rounded-xl bg-[#174824] hover:bg-[#12381c] disabled:bg-[#174824]/40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── CHANGE PASSWORD MODAL ─── */}
      <Dialog open={pwModalOpen} onOpenChange={setPwModalOpen}>
        <DialogContent className="bg-[#fffdfa] border-[#e5d9c3] rounded-[24px] max-w-sm p-6 shadow-xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-[#174824] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#174824]" />
              Change Password
            </DialogTitle>
            <DialogDescription className="text-[11px] text-[#8c7865] font-medium">
              Enter your new password and confirm it
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Input
              label="New Password"
              type={showNewPw ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
              autoFocus
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="cursor-pointer text-[#8c7865] hover:text-[#174824] transition-colors"
                  tabIndex={-1}
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type={showConfirmPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="cursor-pointer text-[#8c7865] hover:text-[#174824] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-[11px] text-red-600 font-semibold">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setPwModalOpen(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="flex-1 h-11 rounded-xl border border-[#e5d9c3] bg-[#faf5eb] hover:bg-[#f3ead8] text-xs font-bold text-[#5a4836] transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={
                isPwSaving ||
                !newPassword.trim() ||
                !confirmPassword.trim() ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
              className="flex-1 h-11 rounded-xl bg-[#174824] hover:bg-[#12381c] disabled:bg-[#174824]/40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>{isPwSaving ? "Saving..." : "Change Password"}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </SacredPortalLayout>
  );
}
