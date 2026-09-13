"use client";

import {
  Trash2,
  CheckCircle2,
  Pencil,
  User,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import LinkedTravelCard from "@/components/travel/LinkedTravelCard";
import ECard from "@/components/common/ECard";
import EButton from "@/components/common/EButton";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import useTasks from "@/hooks/useTasks";
import { Task, TaskModuleType, TaskPriority, TaskStatus } from "@/types/task";

interface TaskDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdated?: () => void;
  onEdit?: (task: Task) => void;
}

export default function TaskDetailDrawer({
  open,
  onOpenChange,
  task,
  onUpdated,
  onEdit,
}: TaskDetailDrawerProps) {
  const { updateTaskStatus, deleteTask } = useTasks();

  if (!task) return null;

  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleToggleStatus = async () => {
    const newStatus = isCompleted ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    const success = await updateTaskStatus(task._id, newStatus);
    if (success) {
      onUpdated?.();
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(task._id);
      if (success) {
        onOpenChange(false);
        onUpdated?.();
      }
    }
  };

  return (
    <EResponsiveDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={task.title}
      description={`Task • ${task.moduleType} Assignment`}
      size="md"
    >
      <div className="space-y-4 pb-4">
        {/* Status Toggle & Priority Header */}
        <ECard variant="sacred" className="p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                isCompleted
                  ? "bg-[#174824] border-[#174824] text-white"
                  : "border-[#8c7865] bg-white hover:border-[#174824]"
              }`}
            >
              {isCompleted && <CheckCircle2 className="w-4 h-4" />}
            </button>
            <span
              className={`text-xs font-bold ${
                isCompleted ? "text-emerald-800 line-through" : "text-[#2c221e]"
              }`}
            >
              {isCompleted ? "Completed" : "In Progress / Pending"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                task.priority === TaskPriority.URGENT
                  ? "bg-red-50 text-red-800 border-red-200"
                  : task.priority === TaskPriority.HIGH
                  ? "bg-orange-50 text-orange-800 border-orange-200"
                  : task.priority === TaskPriority.MEDIUM
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              {task.priority} Priority
            </span>

            {onEdit && (
              <EButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(task);
                }}
                className="h-8 w-8 p-0 text-[#174824]"
                title="Edit Task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </EButton>
            )}

            <EButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </EButton>
          </div>
        </ECard>

        {/* Linked Module Context (Rich Travel Details) */}
        {task.moduleType === TaskModuleType.TRAVEL && (task.moduleRefId || task.moduleTitle) && (
          <LinkedTravelCard
            travelId={task.moduleRefId}
            fallbackTitle={task.moduleTitle}
            onNavigate={() => onOpenChange(false)}
          />
        )}

        {/* Task Description */}
        {task.description && (
          <ECard className="p-3.5 space-y-1">
            <p className="text-[10px] font-bold text-[#8c7865] uppercase tracking-wider">
              Instructions
            </p>
            <p className="text-xs text-[#2c221e] leading-relaxed font-medium">
              {task.description}
            </p>
          </ECard>
        )}

        {/* Assignment Accountability (Assigned To & Assigned By) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Assigned To */}
          <ECard className="p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#8c7865]">
              <User className="w-3.5 h-3.5 text-[#174824]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Assigned To
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#174824]/10 text-[#174824] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : "D"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-[#2c221e] truncate">
                  {task.assignedTo?.name || "Devotee"}
                </p>
                {task.assignedTo?.spiritualName && (
                  <p className="text-[10px] text-[#8c7865] truncate font-medium">
                    {task.assignedTo.spiritualName}
                  </p>
                )}
                <p className="text-[10px] text-[#8c7865] truncate">
                  {task.assignedTo?.email || ""}
                </p>
              </div>
            </div>
          </ECard>

          {/* Assigned By */}
          <ECard className="p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#8c7865]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#174824]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Assigned By
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                {task.assignedBy?.name ? task.assignedBy.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-[#2c221e] truncate">
                  {task.assignedBy?.name || "Admin"}
                </p>
                {task.assignedBy?.email && (
                  <p className="text-[10px] text-[#8c7865] truncate">
                    {task.assignedBy.email}
                  </p>
                )}
                {task.createdAt && (
                  <p className="text-[9px] text-[#8c7865]/80">
                    Created on {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            </div>
          </ECard>
        </div>

        {/* Due Date Card */}
        <ECard variant="sacred" className="p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#174824]" />
            <div>
              <span className="text-[10px] text-[#8c7865] font-bold uppercase tracking-wider block">
                Target Due Date
              </span>
              <span className="font-bold text-xs text-[#2c221e]">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "No deadline specified"}
              </span>
            </div>
          </div>

          {task.dueDate && (
            <span className="text-[10px] font-semibold text-[#174824] bg-white px-2 py-0.5 rounded-lg border border-[#e5d9c3]">
              {new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
                ? "Overdue"
                : "Active Target"}
            </span>
          )}
        </ECard>
      </div>
    </EResponsiveDrawer>
  );
}
