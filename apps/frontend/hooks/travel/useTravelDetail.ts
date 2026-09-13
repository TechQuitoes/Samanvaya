"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import useTasks from "@/hooks/useTasks";
import { Travel } from "@/types/travel";
import { Task, TaskModuleType, TaskStatus } from "@/types/task";

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function useTravelDetail(explicitTravelId?: string) {
  const params = useParams();
  const router = useRouter();
  const travelId = explicitTravelId || (params?.id as string);

  const [travel, setTravel] = useState<Travel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unified Tasks Integration
  const { tasks, fetchTasks, updateTaskStatus } = useTasks(
    travelId ? { moduleType: TaskModuleType.TRAVEL, moduleRefId: travelId } : undefined
  );
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Contextual Expense Modal State
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("TRANSPORT");
  const [expenseAmount, setExpenseAmount] = useState<number>(500);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Fetch Travel Plan Details
  const fetchTravelData = useCallback(async () => {
    if (!travelId) return;
    setIsLoading(true);
    try {
      const travelRes = await apiNexus.call<Travel>("GET_TRAVEL_BY_ID", {
        params: { id: travelId },
      });

      if (travelRes.isSuccess && travelRes.data) {
        setTravel(travelRes.data);
      } else {
        toast.error(travelRes.message || "Failed to load travel details.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load travel details.");
    } finally {
      setIsLoading(false);
    }
  }, [travelId]);

  useEffect(() => {
    fetchTravelData();
  }, [fetchTravelData]);

  // Add Contextual Expense
  const handleAddExpense = useCallback(async () => {
    if (!expenseTitle.trim()) {
      toast.error("Please enter an expense title.");
      return;
    }
    if (!expenseAmount || expenseAmount <= 0) {
      toast.error("Please enter a valid expense amount.");
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const response = await apiNexus.call<Travel>("POST_ADD_TRAVEL_EXPENSE", {
        params: { id: travelId },
        payload: {
          title: expenseTitle.trim(),
          category: expenseCategory,
          amount: Number(expenseAmount),
          currency: "INR",
        },
      });

      if (response.isSuccess) {
        toast.success("Expense added to travel!");
        setExpenseModalOpen(false);
        setExpenseTitle("");
        setExpenseAmount(500);
        setExpenseCategory("TRANSPORT");
        fetchTravelData();
      } else {
        toast.error(response.message || "Failed to add expense.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense.");
    } finally {
      setIsSubmittingExpense(false);
    }
  }, [travelId, expenseTitle, expenseCategory, expenseAmount, fetchTravelData]);

  // Calculations
  const totalExpenses = useMemo(() => {
    return travel?.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
  }, [travel?.expenses]);

  return {
    travelId,
    travel,
    isLoading,
    totalExpenses,
    fetchTravelData,
    router,

    // Task state & handlers
    tasks,
    fetchTasks,
    updateTaskStatus,
    isTaskDrawerOpen,
    setIsTaskDrawerOpen,
    selectedTask,
    setSelectedTask,
    taskToEdit,
    setTaskToEdit,

    // Expense state & handlers
    expenseModalOpen,
    setExpenseModalOpen,
    expenseTitle,
    setExpenseTitle,
    expenseCategory,
    setExpenseCategory,
    expenseAmount,
    setExpenseAmount,
    isSubmittingExpense,
    handleAddExpense,

    // Utilities
    formatDate,
  };
}

export default useTravelDetail;
