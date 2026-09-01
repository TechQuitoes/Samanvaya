"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plane,
  User,
  MessageSquare,
  MoreVertical,
  Trash2,
  Filter,
  Check,
  ExternalLink,
  Heart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SacredPageHeader from "@/components/common/SacredPageHeader";
import { SacredStatCardsGroup, SacredStatCardItem } from "@/components/common/SacredStatCard";
import SacredPillTabs, { SacredPillTabItem } from "@/components/common/SacredPillTabs";
import SacredTableContainer from "@/components/common/SacredTableContainer";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import CreateTaskDrawer from "@/components/task/CreateTaskDrawer";
import TaskDetailDrawer from "@/components/task/TaskDetailDrawer";
import LinkedTravelCard from "@/components/travel/LinkedTravelCard";
import useTasks from "@/hooks/useTasks";
import { Task, TaskModuleType, TaskPriority, TaskStatus } from "@/types/task";

function getModuleCategoryBadge(moduleType?: TaskModuleType) {
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

export default function TasksPage() {
  const router = useRouter();
  const { tasks, isLoading, fetchTasks, updateTaskStatus, deleteTask } = useTasks();

  const [activeTab, setActiveTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [linkedModuleTask, setLinkedModuleTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const q = searchQuery.toLowerCase();
    const assigneeName = t.assignedTo?.name?.toLowerCase() || "";
    const moduleTitle = t.moduleTitle?.toLowerCase() || "";
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      assigneeName.includes(q) ||
      moduleTitle.includes(q)
    );
  });

  const travelTasks = filteredTasks.filter((t) => t.moduleType === TaskModuleType.TRAVEL);
  const completedTasks = filteredTasks.filter((t) => t.status === TaskStatus.COMPLETED);
  const pendingTasks = filteredTasks.filter((t) => t.status !== TaskStatus.COMPLETED);

  const displayedList =
    activeTab === "completed"
      ? completedTasks
      : pendingTasks;

  // Standard Sacred Stat Cards
  const statCards: SacredStatCardItem[] = [
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
  ];

  // Clean Pill Filter Tabs: Only Pending and Completed
  const pillTabs: SacredPillTabItem[] = [
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
  ];

  return (
    <SacredPortalLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-8">
        {/* ─── 1. SACRED PAGE HEADER (Title, Search & Action) ─── */}
        <SacredPageHeader
          title="Tasks & Seva Assignments"
          subtitle="Delegate and monitor operational duties across travel itineraries and temple programs"
          icon={CheckSquare}
          actions={
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-[#8c7865] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, sevaks, tours..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl sm:rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] focus:border-[#174824] outline-none text-[#2c221e] placeholder:text-[#8c7865]/60 w-44 sm:w-60 transition-all shadow-2xs h-9 sm:h-10 font-medium"
                />
              </div>

              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-sm gap-1.5 cursor-pointer h-9 sm:h-10 flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>Assign New Task</span>
              </Button>
            </>
          }
        />

        {/* ─── 2. SACRED STAT CARDS BAR ─── */}
        <SacredStatCardsGroup cards={statCards} isLoading={isLoading} />

        {/* ─── 3. SACRED PILL FILTER TABS (All / Pending / Completed) ─── */}
        <SacredPillTabs
          tabs={pillTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* ─── 4. SACRED TABLE & DATA CONTAINER ─── */}
        <SacredTableContainer
          isEmpty={!isLoading && displayedList.length === 0}
          emptyTitle={`No ${activeTab === "all" ? "" : activeTab} tasks found`}
          emptyDescription="Create a new task to delegate seva responsibilities to your team members."
          emptyIcon={CheckSquare}
          emptyAction={
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              + Assign First Task
            </Button>
          }
        >
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-6 rounded-md bg-[#e5d9c3]/60 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48 bg-[#e5d9c3]/60" />
                    <Skeleton className="h-3 w-72 bg-[#e5d9c3]/40" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl bg-[#e5d9c3]/60 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#e5d9c3] bg-[#faf4e8]/80 text-[#5a4836] font-bold text-xs uppercase tracking-wider">
                      <th className="py-3.5 pl-6 pr-2 w-12 text-center">Done</th>
                      <th className="py-3.5 px-3">Seva Task & Details</th>
                      <th className="py-3.5 px-3">Category / Module</th>
                      <th className="py-3.5 px-3">Devotees (To / By)</th>
                      <th className="py-3.5 px-3">Priority</th>
                      <th className="py-3.5 px-3">Due Date</th>
                      <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5d9c3]/50">
                    {displayedList.map((task) => {
                      const isDone = task.status === TaskStatus.COMPLETED;
                      const isTravel = task.moduleType === TaskModuleType.TRAVEL;

                      return (
                        <tr
                          key={task._id}
                          onClick={() => setSelectedTask(task)}
                          className={`hover:bg-[#fcfaf5] transition-colors cursor-pointer group ${
                            isDone ? "bg-[#faf8f4]/50 opacity-85" : ""
                          }`}
                        >
                          {/* Mark Complete Checkbox */}
                          <td className="py-4 pl-6 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              title={isDone ? "Mark as Incomplete" : "Mark as Completed"}
                              onClick={() =>
                                updateTaskStatus(
                                  task._id,
                                  isDone ? TaskStatus.PENDING : TaskStatus.COMPLETED
                                )
                              }
                              className={`w-5 h-5 rounded-md border flex items-center justify-center mx-auto cursor-pointer transition-all shadow-2xs ${
                                isDone
                                  ? "bg-[#174824] border-[#174824] text-white"
                                  : "bg-[#fffdfa] border-[#8c7865]/70 hover:border-[#174824] text-transparent hover:text-[#174824]/40"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </td>

                          {/* Task Title & Description */}
                          <td className="py-4 px-3">
                            <div className="space-y-0.5 min-w-0 max-w-[280px]">
                              <p
                                className={`font-bold text-sm text-[#2c221e] group-hover:text-[#174824] transition-colors truncate ${
                                  isDone ? "line-through text-[#8c7865]" : ""
                                }`}
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-[11px] text-[#5a4836] font-medium line-clamp-1 truncate">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Module / Category Badge */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            {(() => {
                              const badge = getModuleCategoryBadge(task.moduleType);
                              const Icon = badge.icon;
                              return (
                                <button
                                  type="button"
                                  title="Click to view linked module details"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLinkedModuleTask(task);
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer shadow-2xs ${badge.className}`}
                                >
                                  <Icon className={`w-3.5 h-3.5 ${badge.iconClass}`} />
                                  <span>{badge.label}</span>
                                </button>
                              );
                            })()}
                          </td>

                          {/* Assigned Devotees (To & By) */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[9px] uppercase font-bold text-[#174824] bg-emerald-50 border border-emerald-200/80 px-1 py-0.5 rounded flex-shrink-0">
                                  To
                                </span>
                                <span className="font-bold text-xs text-[#2c221e] truncate max-w-[130px]" title={task.assignedTo?.name}>
                                  {task.assignedTo?.name || "Unassigned"}
                                </span>
                              </div>
                              {task.assignedBy?.name && (
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-[9px] uppercase font-bold text-[#8c7865] bg-[#faf5eb] border border-[#e5d9c3] px-1 py-0.5 rounded flex-shrink-0">
                                    By
                                  </span>
                                  <span className="text-[11px] font-medium text-[#5a4836] truncate max-w-[130px]" title={task.assignedBy.name}>
                                    {task.assignedBy.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                                task.priority === TaskPriority.URGENT
                                  ? "bg-red-50 text-red-800 border-red-200"
                                  : task.priority === TaskPriority.HIGH
                                  ? "bg-orange-50 text-orange-800 border-orange-200"
                                  : task.priority === TaskPriority.MEDIUM
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-blue-50 text-blue-800 border-blue-200"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>

                          {/* Due Date */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            {task.dueDate ? (
                              <p className="font-semibold text-xs text-[#2c221e]">
                                {new Date(task.dueDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            ) : (
                              <span className="text-[11px] text-[#8c7865] font-medium italic">
                                No deadline
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-black/5 text-[#5a4836] cursor-pointer">
                                  <MoreVertical className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="rounded-xl bg-[#fffdfa] border-[#e5d9c3]"
                                >
                                  <DropdownMenuItem
                                    onClick={() => setSelectedTask(task)}
                                    className="text-xs font-medium cursor-pointer"
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTaskToEdit(task);
                                      setIsCreateOpen(true);
                                    }}
                                    className="text-xs font-medium cursor-pointer"
                                  >
                                    Edit Task Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateTaskStatus(
                                        task._id,
                                        isDone ? TaskStatus.PENDING : TaskStatus.COMPLETED
                                      )
                                    }
                                    className="text-xs font-medium cursor-pointer"
                                  >
                                    {isDone ? "Mark Incomplete" : "Mark Completed"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this task?")) {
                                        deleteTask(task._id);
                                      }
                                    }}
                                    className="text-xs font-medium text-red-700 cursor-pointer"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-[#e5d9c3]/60 relative z-10">
                {displayedList.map((task) => {
                  const isDone = task.status === TaskStatus.COMPLETED;

                  return (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-4 space-y-2.5 active:bg-[#faf5eb] transition-colors cursor-pointer select-none ${
                        isDone ? "bg-[#faf8f4]/50 opacity-85" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox + Title */}
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(
                                task._id,
                                isDone ? TaskStatus.PENDING : TaskStatus.COMPLETED
                              );
                            }}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 cursor-pointer flex-shrink-0 transition-colors ${
                              isDone
                                ? "bg-[#174824] border-[#174824] text-white"
                                : "bg-[#fffdfa] border-[#8c7865] hover:border-[#174824]"
                            }`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <div className="min-w-0 space-y-0.5">
                            <p
                              className={`font-bold text-sm text-[#2c221e] truncate ${
                                isDone ? "line-through text-[#8c7865]" : ""
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[11px] text-[#5a4836] font-medium line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                            task.priority === TaskPriority.URGENT
                              ? "bg-red-50 text-red-800 border-red-200"
                              : task.priority === TaskPriority.HIGH
                              ? "bg-orange-50 text-orange-800 border-orange-200"
                              : task.priority === TaskPriority.MEDIUM
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Module context & Devotee */}
                      <div className="text-xs text-[#5a4836] font-medium flex items-center justify-between border-t border-[#e5d9c3]/40 pt-2">
                        <div>
                          {(() => {
                            const badge = getModuleCategoryBadge(task.moduleType);
                            const Icon = badge.icon;
                            return (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLinkedModuleTask(task);
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer shadow-2xs ${badge.className}`}
                              >
                                <Icon className={`w-3 h-3 ${badge.iconClass}`} />
                                <span>{badge.label}</span>
                              </button>
                            );
                          })()}
                        </div>

                        <div className="text-right space-y-0.5">
                          <p className="text-xs font-bold text-[#2c221e]">
                            To: {task.assignedTo?.name || "Devotee"}
                          </p>
                          {task.assignedBy?.name && (
                            <p className="text-[10px] text-[#5a4836] font-medium">
                              By: {task.assignedBy.name}
                            </p>
                          )}
                          <p className="text-[10px] text-[#8c7865]">
                            {task.dueDate
                              ? `Due: ${new Date(task.dueDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}`
                              : "No deadline"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SacredTableContainer>
      </div>

      {/* Create / Edit Task Drawer */}
      <CreateTaskDrawer
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        onSuccess={() => {
          setTaskToEdit(null);
          fetchTasks();
        }}
      />

      {/* Task Details Drawer */}
      <TaskDetailDrawer
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={(task) => {
          setSelectedTask(null);
          setTaskToEdit(task);
          setIsCreateOpen(true);
        }}
        onUpdated={() => {
          fetchTasks();
        }}
      />

      {/* Linked Module Context Dialog / Card */}
      <Dialog
        open={!!linkedModuleTask}
        onOpenChange={(open) => {
          if (!open) setLinkedModuleTask(null);
        }}
      >
        <DialogContent className="bg-[#fffdfa] border-[#e5d9c3] rounded-[24px] sm:rounded-[28px] max-w-lg p-5 sm:p-6 shadow-xl text-[#2c221e]">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2.5 text-[#174824]">
              <div className="p-2 rounded-xl bg-[#174824]/10 border border-[#174824]/20 shadow-2xs">
                {linkedModuleTask?.moduleType === TaskModuleType.TRAVEL ? (
                  <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-[#174824]" />
                ) : linkedModuleTask?.moduleType === TaskModuleType.MEETING ? (
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
                ) : (
                  <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#174824]" />
                )}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold text-[#174824] truncate">
                  {linkedModuleTask?.moduleType === TaskModuleType.TRAVEL
                    ? "Linked Travel Tour"
                    : linkedModuleTask?.moduleType === TaskModuleType.MEETING
                    ? "Linked Meeting"
                    : "Linked Seva Module"}
                </DialogTitle>
                <p className="text-[11px] text-[#8c7865] font-medium">
                  Complete linked context & travel information
                </p>
              </div>
            </div>
          </DialogHeader>

          {linkedModuleTask && (
            <div className="space-y-4 pt-1">
              {linkedModuleTask.moduleType === TaskModuleType.TRAVEL ? (
                <LinkedTravelCard
                  travelId={linkedModuleTask.moduleRefId}
                  fallbackTitle={linkedModuleTask.moduleTitle}
                  onNavigate={() => setLinkedModuleTask(null)}
                />
              ) : (
                <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#e5d9c3] space-y-3 relative overflow-hidden shadow-2xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#8c7865] tracking-wider">
                      Module Reference
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#2c221e]">
                      {linkedModuleTask.moduleTitle || "General Operations"}
                    </p>
                  </div>

                  <div className="border-t border-[#e5d9c3]/60 pt-2.5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#8c7865] tracking-wider">
                      Task Assigned
                    </span>
                    <p className="text-xs font-semibold text-[#174824]">
                      {linkedModuleTask.title}
                    </p>
                    {linkedModuleTask.description && (
                      <p className="text-[11px] text-[#5a4836] leading-relaxed">
                        {linkedModuleTask.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SacredPortalLayout>
  );
}
