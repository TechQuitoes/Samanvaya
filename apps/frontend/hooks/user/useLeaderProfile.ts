"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import {
  LeaderProfile,
  LeaderStatus,
  UpdateLeaderLocationPayload,
} from "@/types/leader-profile";

export function useLeaderProfile() {
  const [profile, setProfile] = useState<LeaderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiNexus.call<LeaderProfile>("GET_LEADER_PROFILE");
      if (response.isSuccess && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || "Failed to load leader profile.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load leader profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: Partial<LeaderProfile>) => {
    setIsSaving(true);
    try {
      const response = await apiNexus.call<LeaderProfile>("PATCH_LEADER_PROFILE", {
        payload,
      });

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to update profile.");
      }

      setProfile(response.data);
      toast.success("Leader profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateLocationStatus = useCallback(
    async (payload: UpdateLeaderLocationPayload) => {
      setIsSaving(true);
      try {
        const response = await apiNexus.call<LeaderProfile>(
          "PATCH_LEADER_LOCATION_STATUS",
          { payload }
        );

        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || "Failed to update location status.");
        }

        setProfile(response.data);
        toast.success("Real-time location & status updated!");
      } catch (err: any) {
        toast.error(err.message || "Failed to update location status.");
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    isSaving,
    fetchProfile,
    updateProfile,
    updateLocationStatus,
  };
}

export default useLeaderProfile;
