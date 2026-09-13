"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { User, UserStatus } from "@/types/auth";
import useAuth from "@/app/(auth)/hooks/useAuth";

export interface ProfileField {
  label: string;
  value: string;
  icon: React.ElementType;
}

export function useUserProfileById(explicitUserId?: string) {
  const params = useParams();
  const userId = explicitUserId || (params?.id as string);

  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResetPwOpen, setIsResetPwOpen] = useState(false);

  const currentRole = (currentUser?.role as string) || "";
  const isAdmin =
    currentRole.toLowerCase().includes("admin") ||
    currentUser?.email === "admin@samanvaya.com";

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiNexus.call<User>("GET_USER_BY_ID", {
        params: { id: userId },
      });
      if (res.isSuccess && res.data) {
        setUser(res.data);
      } else {
        setError(res.message || "User not found.");
      }
    } catch {
      setError("Failed to load user profile.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTempleDisplay = useCallback(() => {
    if (user?.templeName) return user.templeName;
    if (user?.temple && typeof user.temple === "object" && user.temple.name) {
      return user.temple.name;
    }
    return "Not specified";
  }, [user]);

  const getStatusStyle = useCallback((status: string) => {
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
  }, []);

  const profileFields: ProfileField[] = useMemo(() => {
    if (!user) return [];
    return [
      { label: "Email Address", value: user.email || "—", icon: Mail },
      { label: "Mobile", value: user.mobile || "Not specified", icon: Phone },
      { label: "Temple / Ashram", value: getTempleDisplay(), icon: Building2 },
      { label: "City", value: user.city || "Not specified", icon: MapPin },
      { label: "Country", value: user.country || "Not specified", icon: Globe },
      { label: "Role", value: user.role || "—", icon: ShieldCheck },
      { label: "Member Since", value: formatDate(user.createdAt), icon: Calendar },
    ];
  }, [user, getTempleDisplay]);

  return {
    userId,
    user,
    isLoading,
    error,
    isAdmin,
    isResetPwOpen,
    setIsResetPwOpen,
    profileFields,
    getStatusStyle,
    refetchUser: fetchUser,
  };
}

export default useUserProfileById;
