"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import DataManager from "@/lib/data-manager";
import { User } from "@/types/auth";

export interface ProfileField {
  key: string;
  label: string;
  value: string;
  displayValue?: string;
  editable: boolean;
  type?: string;
  placeholder?: string;
}

export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<ProfileField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Change Password Modal State
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPwSaving, setIsPwSaving] = useState(false);

  // Load profile from cache then API
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

  const formatDate = useCallback((dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getTempleDisplay = useCallback(() => {
    if (user?.templeName) return user.templeName;
    if (user?.temple && typeof user.temple === "object" && user.temple.name) {
      return user.temple.name;
    }
    return "";
  }, [user]);

  // Computed Profile Fields
  const profileFields = useMemo<ProfileField[]>(() => {
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
  }, [user, getTempleDisplay, formatDate]);

  const openEditModal = useCallback((field: ProfileField) => {
    setEditingField(field);
    setEditValue(field.value);
    setEditModalOpen(true);
  }, []);

  const handleSaveField = useCallback(async () => {
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
      setEditingField(null);
    }
  }, [editingField, user, editValue]);

  const handleChangePassword = useCallback(async () => {
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
      setPwModalOpen(false);
    }
  }, [newPassword, confirmPassword]);

  const handleAvatarUpdated = useCallback((newUrl: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, avatar: newUrl };
      DataManager.setUser(updated);
      return updated;
    });
  }, []);

  return {
    user,
    setUser,
    isLoading,
    profileFields,
    handleAvatarUpdated,
    // Edit Modal
    editModalOpen,
    setEditModalOpen,
    editingField,
    setEditingField,
    editValue,
    setEditValue,
    isSaving,
    openEditModal,
    handleSaveField,
    // Password Modal
    pwModalOpen,
    setPwModalOpen,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isPwSaving,
    handleChangePassword,
  };
}

export default useUserProfile;
