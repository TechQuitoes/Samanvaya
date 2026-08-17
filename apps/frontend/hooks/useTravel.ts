"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import {
  Travel,
  TravelStatus,
  CreateTravelPayload,
  TravelTask,
  TaskStatus,
} from "@/types/travel";

export function useTravel(statusFilter?: TravelStatus) {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTravels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiNexus.call<Travel[]>("GET_TRAVELS", {
        queryParams: statusFilter ? { status: statusFilter } : undefined,
      });

      if (response.isSuccess && Array.isArray(response.data)) {
        setTravels(response.data);
      } else {
        setTravels([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load travel records.");
      setTravels([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const createTravel = useCallback(async (payload: CreateTravelPayload): Promise<Travel | null> => {
    setIsSubmitting(true);
    try {
      const response = await apiNexus.call<Travel>("POST_CREATE_TRAVEL", {
        payload,
      });

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to create travel record.");
      }

      toast.success("Travel record created successfully!");
      return response.data;
    } catch (err: any) {
      toast.error(err.message || "Failed to create travel record.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const addExpense = useCallback(
    async (travelId: string, expense: { title: string; category?: string; amount: number; currency?: string; receiptUrl?: string; paymentMethod?: string }) => {
      try {
        const response = await apiNexus.call<Travel>("POST_ADD_TRAVEL_EXPENSE", {
          params: { id: travelId },
          payload: expense,
        });

        if (!response.isSuccess) {
          throw new Error(response.message || "Failed to add expense.");
        }

        toast.success("Expense added to travel record!");
        fetchTravels();
      } catch (err: any) {
        toast.error(err.message || "Failed to add expense.");
      }
    },
    [fetchTravels]
  );

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  return {
    travels,
    isLoading,
    isSubmitting,
    fetchTravels,
    createTravel,
    addExpense,
  };
}

export default useTravel;
