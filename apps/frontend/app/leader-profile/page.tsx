"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Save,
  Lock,
  Check,
  X,
  Loader2,
  User as UserIcon,
  Mail,
  Building,
  MapPin,
  Globe,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import ESkeleton from "@/components/common/ESkeleton";
import ECard from "@/components/common/ECard";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import SacredAvatarUpload from "@/components/common/SacredAvatarUpload";
import EModal from "@/components/common/EModal";
import EButton from "@/components/common/EButton";
import EInput from "@/components/common/EInput";
import EMobileInput from "@/components/common/EMobileInput";
import EPasswordInput from "@/components/common/EPasswordInput";
import useUserProfile from "@/hooks/user/useUserProfile";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isLoading,
    profileFields,
    handleAvatarUpdated,
    editModalOpen,
    setEditModalOpen,
    editingField,
    setEditingField,
    editValue,
    setEditValue,
    isSaving,
    openEditModal,
    handleSaveField,
    pwModalOpen,
    setPwModalOpen,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isPwSaving,
    handleChangePassword,
  } = useUserProfile();

  const getFieldIcon = (key: string) => {
    switch (key) {
      case "name":
        return <UserIcon className="w-3.5 h-3.5 text-[#174824]" />;
      case "email":
        return <Mail className="w-3.5 h-3.5 text-[#174824]" />;
      case "templeName":
        return <Building className="w-3.5 h-3.5 text-[#174824]" />;
      case "city":
        return <MapPin className="w-3.5 h-3.5 text-[#174824]" />;
      case "country":
        return <Globe className="w-3.5 h-3.5 text-[#174824]" />;
      case "role":
        return <ShieldCheck className="w-3.5 h-3.5 text-[#174824]" />;
      case "status":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "createdAt":
        return <Calendar className="w-3.5 h-3.5 text-[#174824]" />;
      default:
        return undefined;
    }
  };

  return (
    <SacredPortalLayout>
      <div className="max-w-lg mx-auto space-y-5 pb-10">
        {/* Back Nav */}
        <EButton
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back
        </EButton>

        {/* PROFILE CARD */}
        {isLoading || !user ? (
          <ECard className="p-6 space-y-4">
            <div className="flex flex-col items-center gap-3">
              <ESkeleton variant="circular" className="w-20 h-20" />
              <ESkeleton className="h-5 w-32" />
            </div>
            <ESkeleton
              count={6}
              className="h-14 w-full rounded-2xl"
              containerClassName="space-y-3 pt-4"
            />
          </ECard>
        ) : (
          <ECard className="p-0 overflow-hidden">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-[#e5d9c3]/60">
              <SacredAvatarUpload
                avatarUrl={user.avatar}
                userName={user.name}
                size="lg"
                editable={true}
                onAvatarUpdated={handleAvatarUpdated}
              />

              <h2 className="mt-3 text-lg font-bold text-[#174824]">
                {user.name}
              </h2>

              <span className="mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300">
                {user.role}
              </span>
            </div>

            {/* Field Rows with EInput / EMobileInput */}
            <div className="p-5 sm:p-6 divide-y divide-[#e5d9c3]/50">
              {profileFields.map((field, idx) => {
                const isEditing = editingField?.key === field.key;
                const isMobile = field.key === "mobile" || field.type === "tel";
                const FieldInput = isMobile ? EMobileInput : EInput;

                return (
                  <div key={field.key} className={idx > 0 ? "pt-3.5 pb-1" : "pb-1"}>
                    <FieldInput
                      label={field.label}
                      type={isMobile ? undefined : (field.type || "text")}
                      value={isEditing ? editValue : (field.displayValue || "")}
                      onChange={isEditing ? (e) => setEditValue(e.target.value) : undefined}
                      viewOnly={!isEditing}
                      autoFocus={isEditing}
                      placeholder={field.placeholder}
                      countryCode={isMobile ? "+91" : undefined}
                      leftIcon={isMobile ? undefined : getFieldIcon(field.key)}
                      onKeyDown={
                        isEditing
                          ? (e) => {
                              if (e.key === "Enter") handleSaveField();
                              if (e.key === "Escape") {
                                setEditingField(null);
                                setEditValue("");
                              }
                            }
                          : undefined
                      }
                      onEdit={
                        field.editable && !isEditing
                          ? () => {
                              setEditingField(field);
                              setEditValue(field.value);
                            }
                          : undefined
                      }
                      rightElement={
                        isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={handleSaveField}
                              disabled={isSaving || editValue.trim() === field.value}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#174824] hover:bg-[#12391c] text-white disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
                              title="Save"
                              aria-label="Save"
                            >
                              {isSaving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingField(null);
                                setEditValue("");
                              }}
                              disabled={isSaving}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#e5d9c3]/50 hover:bg-[#e5d9c3] text-[#5a4836] transition-all cursor-pointer"
                              title="Cancel"
                              aria-label="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : undefined
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* Change Password */}
            <div className="px-6 py-5 border-t border-[#e5d9c3]/60">
              <EButton
                variant="primary"
                onClick={() => setPwModalOpen(true)}
                leftIcon={<Lock className="w-4 h-4 text-amber-300" />}
                fullWidth
              >
                Change Password
              </EButton>
            </div>
          </ECard>
        )}
      </div>

      {/* ─── EDIT FIELD MODAL ─── */}
      <EModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={`Edit ${editingField?.label}`}
        subtitle={`Update your ${editingField?.label?.toLowerCase()} and save`}
        size="sm"
        footer={
          <div className="flex items-center gap-3 pt-1 w-full">
            <EButton
              variant="secondary"
              onClick={() => setEditModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </EButton>
            <EButton
              variant="primary"
              onClick={handleSaveField}
              isLoading={isSaving}
              loadingText="Saving..."
              disabled={isSaving || editValue.trim() === editingField?.value}
              leftIcon={<Save className="w-3.5 h-3.5 text-amber-300" />}
              className="flex-1"
            >
              Save Changes
            </EButton>
          </div>
        }
      >
        <div className="py-2">
          {editingField?.key === "mobile" || editingField?.type === "tel" ? (
            <EMobileInput
              label={editingField?.label}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={
                editingField?.placeholder ||
                `Enter ${editingField?.label.toLowerCase()}`
              }
              autoFocus
            />
          ) : (
            <EInput
              label={editingField?.label}
              type={editingField?.type || "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={
                editingField?.placeholder ||
                `Enter ${editingField?.label.toLowerCase()}`
              }
              autoFocus
            />
          )}
        </div>
      </EModal>

      {/* ─── CHANGE PASSWORD MODAL ─── */}
      <EModal
        open={pwModalOpen}
        onOpenChange={setPwModalOpen}
        icon={<Lock className="w-4 h-4 text-[#174824]" />}
        title="Change Password"
        subtitle="Enter your new password and confirm it"
        size="sm"
        footer={
          <div className="flex items-center gap-3 pt-1 w-full">
            <EButton
              variant="secondary"
              onClick={() => {
                setPwModalOpen(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="flex-1"
            >
              Cancel
            </EButton>
            <EButton
              variant="primary"
              onClick={handleChangePassword}
              isLoading={isPwSaving}
              loadingText="Saving..."
              disabled={
                isPwSaving ||
                !newPassword.trim() ||
                !confirmPassword.trim() ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
              leftIcon={<Lock className="w-3.5 h-3.5 text-amber-300" />}
              className="flex-1"
            >
              Change Password
            </EButton>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <EPasswordInput
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 chars)"
            autoFocus
          />

          <EPasswordInput
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            error={
              confirmPassword.length > 0 && newPassword !== confirmPassword
                ? "Passwords do not match"
                : undefined
            }
          />
        </div>
      </EModal>
    </SacredPortalLayout>
  );
}
