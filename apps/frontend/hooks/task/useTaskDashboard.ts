"use client";

import { useState, useMemo, useCallback } from "react";
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  Plane,
  Users,
} from "lucide-react";
import useTasks from "./useTasks";
import { Task, TaskModuleType, TaskStatus } from "@/types/task";
import { SacredStatCardItem } from "@/components/common/SacredStatCard";
import { SacredPillTabItem } from "@/components/common/SacredPillTabs";

export function getModuleCategoryBadge(moduleType?: TaskModuleType) {
  switch (moduleType) {
    case TaskModuleType.TRAVEL:
      return {
        label: "Travel",
        icon: Plane,
        className: "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/90",
        iconClass: "text-emerald-700",
      };
    case TaskModuleType.MEETING:
      return {
        label: "Meeting",
        icon: Users,
        className: "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100/90",
        iconClass: "text-blue-700",
      };
    case TaskModuleType.EVENT:
      return {
        label: "Event",
        icon: Calendar,
        className: "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100/90",
        iconClass: "text-purple-700",
      };
    default:
      return {
        label: "General",
        icon: CheckSquare,
        className: "bg-[#faf5eb] text-[#5a4836] border-[#e5d9c3] hover:bg-[#f3ebd9]",
        iconClass: "text-[#8c7865]",
      };
  }
}

export function useTaskDashboard() {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, deleteTask } = useTasks();

  const [activeTab, setActiveTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [linkedModuleTask, setLinkedModuleTask] = useState<Task | null>(null);

  // Search and filter tasks
  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => {
      const assigneeName = t.assignedTo?.name?.toLowerCase() || "";
      const moduleTitle = t.moduleTitle?.toLowerCase() || "";
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        assigneeName.includes(q) ||
        moduleTitle.includes(q)
      );
    });
  }, [tasks, searchQuery]);

  const travelTasks = useMemo(
    () => filteredTasks.filter((t) => t.moduleType === TaskModuleType.TRAVEL),
    [filteredTasks]
  );

  const completedTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === TaskStatus.COMPLETED),
    [filteredTasks]
  );

  const pendingTasks = useMemo(
    () => filteredTasks.filter((t) => t.status !== TaskStatus.COMPLETED),
    [filteredTasks]
  );

  const displayedList = activeTab === "completed" ? completedTasks : pendingTasks;

  // Standard Sacred Stat Cards
  const statCards: SacredStatCardItem[] = useMemo(
    () => [
      {
        title: "Pending Seva",
        value: pendingTasks.length,
        subtitle: "Active Duties",
        icon: Clock,
        variant: "amber",
        pulsingIcon: pendingTasks.length > 0,
      },
      {
        title: "Travel Seva",
        value: travelTasks.length,
        subtitle: "Tour Coordinations",
        icon: Plane,
        variant: "emerald",
      },
      {
        title: "Completed",
        value: completedTasks.length,
        subtitle: `${tasks.length} Total Assigned`,
        icon: CheckCircle2,
        variant: "default",
      },
    ],
    [pendingTasks.length, travelTasks.length, completedTasks.length, tasks.length]
  );

  // Clean Pill Filter Tabs: Only Pending and Completed
  const pillTabs: SacredPillTabItem[] = useMemo(
    () => [
      {
        id: "pending",
        label: "Pending Tasks",
        count: pendingTasks.length,
        icon: Clock,
        countVariant: "amber",
      },
      {
        id: "completed",
        label: "Completed",
        count: completedTasks.length,
        icon: CheckCircle2,
      },
    ],
    [pendingTasks.length, completedTasks.length]
  );

  // Action helpers
  const handleToggleStatus = useCallback(
    (taskId: string, isDone: boolean) => {
      return updateTaskStatus(
        taskId,
        isDone ? TaskStatus.PENDING : TaskStatus.COMPLETED
      );
    },
    [updateTaskStatus]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      if (confirm("Are you sure you want to delete this task?")) {
        return deleteTask(taskId);
      }
    },
    [deleteTask]
  );

  const openCreateDrawer = useCallback(() => {
    setTaskToEdit(null);
    setIsCreateOpen(true);
  }, []);

  const openEditDrawer = useCallback((task: Task) => {
    setSelectedTask(null);
    setTaskToEdit(task);
    setIsCreateOpen(true);
  }, []);

  const closeCreateDrawer = useCallback(() => {
    setIsCreateOpen(false);
    setTaskToEdit(null);
  }, []);

  return {
    tasks,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isCreateOpen,
    setIsCreateOpen,
    selectedTask,
    setSelectedTask,
    taskToEdit,
    setTaskToEdit,
    linkedModuleTask,
    setLinkedModuleTask,
    displayedList,
    statCards,
    pillTabs,
    handleToggleStatus,
    handleDeleteTask,
    openCreateDrawer,
    openEditDrawer,
    closeCreateDrawer,
    fetchTasks,
  };
}

export default useTaskDashboard;
