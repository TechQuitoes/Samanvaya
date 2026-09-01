"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import {
  Task,
  TaskModuleType,
  TaskPriority,
  TaskStatus,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/types/task";

export interface TaskFilters {
  moduleType?: TaskModuleType;
  moduleRefId?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export function useTasks(initialFilters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moduleType = initialFilters?.moduleType;
  const moduleRefId = initialFilters?.moduleRefId;
  const assignedTo = initialFilters?.assignedTo;
  const status = initialFilters?.status;
  const priority = initialFilters?.priority;

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = filters || {
        moduleType,
        moduleRefId,
        assignedTo,
        status,
        priority,
      };
      const response = await apiNexus.call<Task[]>("GET_TASKS", {
        queryParams: activeFilters as any,
      });

      if (response.isSuccess && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load tasks.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [moduleType, moduleRefId, assignedTo, status, priority]);

  const createTask = useCallback(
    async (payload: CreateTaskPayload): Promise<Task | null> => {
      setIsSubmitting(true);
      try {
        const response = await apiNexus.call<Task>("POST_CREATE_TASK", {
          payload,
        });

        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || "Failed to create task.");
        }

        toast.success("Seva task created and assigned successfully! 📋");
        await fetchTasks();
        return response.data;
      } catch (err: any) {
        toast.error(err.message || "Failed to create task.");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchTasks]
  );

  const updateTask = useCallback(
    async (taskId: string, payload: UpdateTaskPayload): Promise<Task | null> => {
      setIsSubmitting(true);
      try {
        const response = await apiNexus.call<Task>("PATCH_UPDATE_TASK", {
          params: { id: taskId },
          payload,
        });

        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || "Failed to update task.");
        }

        toast.success("Task updated successfully! 📋");
        await fetchTasks();
        return response.data;
      } catch (err: any) {
        toast.error(err.message || "Failed to update task.");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchTasks]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus, commentText?: string): Promise<boolean> => {
      try {
        const response = await apiNexus.call<Task>("PATCH_UPDATE_TASK_STATUS", {
          params: { id: taskId },
          payload: { status, commentText },
        });

        if (!response.isSuccess) {
          throw new Error(response.message || "Failed to update task status.");
        }

        const statusMsg =
          status === TaskStatus.COMPLETED
            ? "Task marked as Completed! ✅"
            : `Task moved to ${status}`;
        toast.success(statusMsg);
        await fetchTasks();
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to update task status.");
        return false;
      }
    },
    [fetchTasks]
  );

  const addTaskComment = useCallback(
    async (taskId: string, commentText: string): Promise<boolean> => {
      try {
        const response = await apiNexus.call<Task>("POST_ADD_TASK_COMMENT", {
          params: { id: taskId },
          payload: { commentText },
        });

        if (!response.isSuccess) {
          throw new Error(response.message || "Failed to add comment.");
        }

        toast.success("Update comment added!");
        await fetchTasks();
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to add comment.");
        return false;
      }
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<boolean> => {
      try {
        const response = await apiNexus.call("DELETE_TASK", {
          params: { id: taskId },
        });

        if (!response.isSuccess) {
          throw new Error(response.message || "Failed to delete task.");
        }

        toast.success("Task deleted successfully.");
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to delete task.");
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    isSubmitting,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    addTaskComment,
    deleteTask,
  };
}

export default useTasks;
