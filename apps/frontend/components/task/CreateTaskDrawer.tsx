"use client";

import { useState, useEffect } from "react";
import {
  CheckSquare,
  User,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Plane,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import ESelect, { ESelectOption } from "@/components/common/ESelect";
import EDateTimePicker from "@/components/common/EDateTimePicker";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import useTasks from "@/hooks/useTasks";
import { Task, TaskModuleType, TaskPriority, TaskStatus } from "@/types/task";

interface UserOption {
  _id: string;
  name: string;
  email: string;
  role?: string;
  spiritualName?: string;
  initiatedName?: string;
}

interface CreateTaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task | null;
  initialModuleType?: TaskModuleType;
  initialModuleRefId?: string;
  initialModuleTitle?: string;
  onSuccess?: (task: Task) => void;
}

export default function CreateTaskDrawer({
  open,
  onOpenChange,
  taskToEdit,
  initialModuleType = TaskModuleType.GENERAL,
  initialModuleRefId,
  initialModuleTitle,
  onSuccess,
}: CreateTaskDrawerProps) {
  const { createTask, updateTask, isSubmitting } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState("");

  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || "");
        setDescription(taskToEdit.description || "");
        setAssignedTo(taskToEdit.assignedTo?._id || "");
        setPriority(taskToEdit.priority || TaskPriority.MEDIUM);
        setDueDate(
          taskToEdit.dueDate
            ? new Date(taskToEdit.dueDate).toISOString().slice(0, 16)
            : ""
        );
      } else {
        setTitle("");
        setDescription("");
        setPriority(TaskPriority.MEDIUM);
        setDueDate("");
      }

      // Fetch users for assignment dropdown
      const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
          const res = await apiNexus.call<UserOption[]>("GET_USERS");
          if (res.isSuccess && Array.isArray(res.data)) {
            setUsers(res.data);
            if (res.data.length > 0 && !assignedTo && !taskToEdit) {
              setAssignedTo(res.data[0]._id);
            }
          }
        } catch (e) {
          console.error("Failed to load users for task assignment", e);
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [open, taskToEdit]);

  const devoteeOptions: ESelectOption[] = users.map((u) => ({
    value: u._id,
    label: u.spiritualName ? `${u.name} (${u.spiritualName})` : u.name,
    icon: User,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a task title.");
      return;
    }
    if (!assignedTo) {
      alert("Please select a devotee/leader to assign this task.");
      return;
    }

    if (taskToEdit?._id) {
      // Edit Mode
      const updated = await updateTask(taskToEdit._id, {
        title: title.trim(),
        description: description.trim() || undefined,
        assignedTo,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      if (updated) {
        onOpenChange(false);
        onSuccess?.(updated);
      }
    } else {
      // Create Mode
      const created = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        moduleType: initialModuleType,
        moduleRefId: initialModuleRefId,
        moduleTitle: initialModuleTitle,
        assignedTo,
        priority,
        status: TaskStatus.PENDING,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      if (created) {
        setTitle("");
        setDescription("");
        setDueDate("");
        onOpenChange(false);
        onSuccess?.(created);
      }
    }
  };

  const isEditMode = Boolean(taskToEdit?._id);

  return (
    <EResponsiveDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Seva Task" : "Assign Seva / Operational Task"}
      description={
        isEditMode
          ? "Update task details, deadline, assignee, and priority."
          : "Delegate tasks with priorities, deadlines, and notifications."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
        {/* Scrollable Form Fields */}
        <div className="flex-1 space-y-4 pb-4">
          {/* Module Context Banner if linked */}
          {initialModuleType === TaskModuleType.TRAVEL && initialModuleTitle && (
            <div className="p-3 rounded-2xl bg-[#faf5eb] border border-[#e5d9c3] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#174824] text-white flex items-center justify-center flex-shrink-0">
                <Plane className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#8c7865] uppercase tracking-wider">
                  Linked Travel Itinerary
                </p>
                <p className="text-xs font-bold text-[#174824] truncate">
                  {initialModuleTitle}
                </p>
              </div>
            </div>
          )}

          {/* Task Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#174824] uppercase tracking-wider">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Airport Pickup Coordination / Garland Seva"
              className="w-full text-xs font-medium text-[#2c221e] bg-[#faf5eb]/70 rounded-xl border border-[#e5d9c3] focus:border-[#174824] outline-none p-3 placeholder:text-[#8c7865]/60 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#174824] uppercase tracking-wider">
              Instructions / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed instructions, contact numbers, special arrangements..."
              className="w-full text-xs font-medium text-[#2c221e] bg-[#faf5eb]/70 rounded-xl border border-[#e5d9c3] focus:border-[#174824] outline-none p-3 placeholder:text-[#8c7865]/60 transition-all resize-none"
            />
          </div>

          {/* Assign To Leader / Devotee (Searchable ESelect showing only Name) */}
          <div>
            <ESelect
              label="Assign To (Devotee / Leader)"
              required
              searchable
              placeholder={isLoadingUsers ? "Loading devotees..." : "Search & select devotee by name..."}
              value={assignedTo}
              onChange={setAssignedTo}
              options={devoteeOptions}
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#174824] uppercase tracking-wider">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: TaskPriority.LOW, label: "Low", color: "bg-blue-50 text-blue-800 border-blue-200" },
                { level: TaskPriority.MEDIUM, label: "Medium", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { level: TaskPriority.HIGH, label: "High", color: "bg-orange-50 text-orange-800 border-orange-200" },
                { level: TaskPriority.URGENT, label: "Urgent", color: "bg-red-50 text-red-800 border-red-200" },
              ].map((p) => (
                <button
                  key={p.level}
                  type="button"
                  onClick={() => setPriority(p.level)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    priority === p.level
                      ? `${p.color} ring-2 ring-offset-1 ring-[#174824]`
                      : "bg-[#faf5eb] border-[#e5d9c3] text-[#8c7865] hover:bg-[#f5ebd6]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Due Date (Custom EDateTimePicker) */}
          <div>
            <EDateTimePicker
              label="Target Due Date"
              value={dueDate}
              onChange={setDueDate}
              placeholder="Select target due date & time"
              includeTime={true}
            />
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="mt-auto sticky bottom-0 bg-[#fffdfa] pt-3 pb-1 border-t border-[#e5d9c3]/70 flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border-[#e5d9c3] text-xs font-bold h-11 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-[#174824] hover:bg-[#174824]/90 text-white text-xs font-bold h-11 cursor-pointer shadow-md gap-1.5"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>
              {isSubmitting
                ? isEditMode
                  ? "Saving Changes..."
                  : "Assigning..."
                : isEditMode
                ? "Save Changes"
                : "Assign Task"}
            </span>
          </Button>
        </div>
      </form>
    </EResponsiveDrawer>
  );
}
