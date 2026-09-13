"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  UserCircle,
  KeyRound,
} from "lucide-react";
import ESkeleton from "@/components/common/ESkeleton";
import EButton from "@/components/common/EButton";
import EAvatar from "@/components/common/EAvatar";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import { UserStatus } from "@/types/auth";
import ResetPasswordModal from "@/components/users/ResetPasswordModal";
import useUserProfileById from "@/hooks/user/useUserProfileById";

export default function UserProfileByIdPage() {
  const router = useRouter();
  const {
    user,
    isLoading,
    error,
    isAdmin,
    isResetPwOpen,
    setIsResetPwOpen,
    profileFields,
    getStatusStyle,
  } = useUserProfileById();

  return (
    <SacredPortalLayout>
      <div className="max-w-lg mx-auto space-y-5 pb-10">
        {/* Back Nav */}
        <EButton
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back
        </EButton>

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 rounded-3xl bg-[#faf4e8] border border-[#e5d9c3] space-y-4">
            <div className="flex flex-col items-center gap-3">
              <ESkeleton variant="circular" className="w-20 h-20" />
              <ESkeleton className="h-5 w-32" />
            </div>
            <ESkeleton
              count={6}
              className="h-14 w-full rounded-2xl"
              containerClassName="space-y-3 pt-4"
            />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-8 rounded-3xl bg-[#faf4e8] border border-[#e5d9c3] text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-100 mx-auto flex items-center justify-center">
              <UserCircle className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-[#174824]">{error}</h3>
            <p className="text-xs text-[#5a4836]">
              The user profile could not be loaded. Please check the link and try again.
            </p>
          </div>
        )}

        {/* Profile Card (read-only view) */}
        {!isLoading && user && (
          <div className="rounded-3xl bg-[#faf4e8] border border-[#e5d9c3] overflow-hidden shadow-2xs">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-[#e5d9c3]/60">
              <EAvatar
                src={user.avatar}
                name={user.name}
                size="2xl"
                variant="sacred"
                className="w-20 h-20 text-2xl shadow-sm"
              />

              <h2 className="mt-3 text-lg font-bold text-[#174824]">
                {user.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300">
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center text-[10px] px-2 py-0.5 font-semibold rounded-full border ${getStatusStyle(user.status)}`}
                >
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  {user.status === UserStatus.PENDING_APPROVAL
                    ? "Pending"
                    : user.status}
                </span>
              </div>
            </div>

            {/* Field Rows */}
            <div className="divide-y divide-[#e5d9c3]/50">
              {profileFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.label}
                    className="flex items-center px-6 py-3.5 gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#174824]/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#174824]/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-[#8c7865] uppercase tracking-wider">
                        {field.label}
                      </p>
                      <p className="text-sm font-semibold text-[#2c221e] mt-0.5 truncate">
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Action: Reset Password */}
            {isAdmin && (
              <div className="px-6 py-4 border-t border-[#e5d9c3]/60 bg-[#faf5eb]/50">
                <EButton
                  variant="primary"
                  className="w-full h-11 text-xs font-bold"
                  onClick={() => setIsResetPwOpen(true)}
                  leftIcon={<KeyRound className="w-4 h-4 text-amber-300" />}
                >
                  Reset User Password
                </EButton>
              </div>
            )}
          </div>
        )}

        {/* Reset Password Modal */}
        <ResetPasswordModal
          user={user}
          isOpen={isResetPwOpen}
          onClose={() => setIsResetPwOpen(false)}
        />
      </div>
    </SacredPortalLayout>
  );
}
