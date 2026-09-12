"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Calendar,
  ShieldCheck,
  Loader2,
  UserCircle,
  KeyRound,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { User, UserStatus } from "@/types/auth";
import useAuth from "@/app/(auth)/hooks/useAuth";
import ResetPasswordModal from "@/app/(admin)/components/ResetPasswordModal";

export default function UserProfileByIdPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResetPwOpen, setIsResetPwOpen] = useState(false);

  const currentRole = (currentUser?.role as string) || "";
  const isAdmin =
    currentRole.toLowerCase().includes("admin") ||
    currentUser?.email === "admin@samanvaya.com";

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    apiNexus
      .call<User>("GET_USER_BY_ID", { params: { id: userId } })
      .then((res) => {
        if (res.isSuccess && res.data) {
          setUser(res.data);
        } else {
          setError("User not found.");
        }
      })
      .catch(() => {
        setError("Failed to load user profile.");
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTempleDisplay = () => {
    if (user?.templeName) return user.templeName;
    if (user?.temple && typeof user.temple === "object" && user.temple.name) {
      return user.temple.name;
    }
    return "Not specified";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case UserStatus.APPROVED:
        return "border-emerald-300 text-emerald-800 bg-emerald-50/90";
      case UserStatus.BLOCKED:
        return "border-rose-300 text-rose-800 bg-rose-50/90";
      case UserStatus.REJECTED:
        return "border-red-300 text-red-800 bg-red-50/90";
      default:
        return "border-amber-300 text-amber-800 bg-amber-50/90";
    }
  };

  interface ProfileField {
    label: string;
    value: string;
    icon: React.ElementType;
  }

  const profileFields: ProfileField[] = user
    ? [
        { label: "Email Address", value: user.email || "—", icon: Mail },
        { label: "Mobile", value: user.mobile || "Not specified", icon: Phone },
        { label: "Temple / Ashram", value: getTempleDisplay(), icon: Building2 },
        { label: "City", value: user.city || "Not specified", icon: MapPin },
        { label: "Country", value: user.country || "Not specified", icon: Globe },
        { label: "Role", value: user.role || "—", icon: ShieldCheck },
        { label: "Member Since", value: formatDate(user.createdAt), icon: Calendar },
      ]
    : [];

  return (
    <SacredPortalLayout>
      <div className="max-w-lg mx-auto space-y-5 pb-10">
        {/* Back Nav */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174824] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Loading State */}
        {isLoading && (
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
              <div className="w-20 h-20 rounded-full bg-[#174824]/10 border-2 border-[#174824]/20 flex items-center justify-center overflow-hidden relative shadow-sm">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#174824]">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-lg font-bold text-[#174824]">
                {user.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300">
                  {user.role}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0.5 font-semibold ${getStatusStyle(user.status)}`}
                >
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  {user.status === UserStatus.PENDING_APPROVAL
                    ? "Pending"
                    : user.status}
                </Badge>
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
                <button
                  type="button"
                  onClick={() => setIsResetPwOpen(true)}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#174824] hover:bg-[#12381c] text-white text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-[0.99]"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>Reset User Password</span>
                </button>
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
