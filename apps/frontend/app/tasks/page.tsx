"use client";

import {
  CheckSquare,
  Plus,
  Search,
  MoreVertical,
  Check,
  Plane,
  Users,
} from "lucide-react";
import EButton from "@/components/common/EButton";
import ECard from "@/components/common/ECard";
import EInput from "@/components/common/EInput";
import ESelect from "@/components/common/ESelect";
import ESkeleton from "@/components/common/ESkeleton";
import EModal from "@/components/common/EModal";
import ETable, {
  ETableHeader,
  ETableBody,
  ETableRow,
  ETableHead,
  ETableCell,
} from "@/components/common/ETable";
import { SacredStatCardsGroup } from "@/components/common/SacredStatCard";
import SacredPillTabs from "@/components/common/SacredPillTabs";
import SacredTableContainer from "@/components/common/SacredTableContainer";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import CreateTaskDrawer from "@/components/task/CreateTaskDrawer";
import TaskDetailDrawer from "@/components/task/TaskDetailDrawer";
import LinkedTravelCard from "@/components/travel/LinkedTravelCard";
import { useTaskDashboard, getModuleCategoryBadge } from "@/hooks/task";
import { TaskModuleType, TaskPriority, TaskStatus } from "@/types/task";

export default function TasksPage() {
  const {
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
    fetchTasks,
  } = useTaskDashboard();

  return (
    <SacredPortalLayout
      title="Tasks & Seva Assignments"
      subtitle="Delegate and monitor operational duties across travel itineraries and temple programs"
      icon={CheckSquare}
      actions={
        <>
          <EInput
            icon={Search}
            inputSize="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, sevaks, tours..."
            wrapperClassName="w-44 sm:w-60"
          />

          <EButton
            variant="sacred-primary"
            size="sm"
            onClick={openCreateDrawer}
            leftIcon={<Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />}
          >
            Assign New Task
          </EButton>
        </>
      }
    >

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
            <EButton
              variant="sacred-primary"
              size="sm"
              onClick={openCreateDrawer}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Assign First Task
            </EButton>
          }
        >
          {isLoading ? (
            <div className="p-6 space-y-3">
              <ESkeleton count={4} height={52} variant="card" />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <ETable>
                  <ETableHeader>
                    <ETableRow>
                      <ETableHead className="pl-6 w-12 text-center">Done</ETableHead>
                      <ETableHead>Seva Task & Details</ETableHead>
                      <ETableHead>Category / Module</ETableHead>
                      <ETableHead>Devotees (To / By)</ETableHead>
                      <ETableHead>Priority</ETableHead>
                      <ETableHead>Due Date</ETableHead>
                      <ETableHead alignRight className="pr-6">Actions</ETableHead>
                    </ETableRow>
                  </ETableHeader>
                  <ETableBody>
                    {displayedList.map((task) => {
                      const isDone = task.status === TaskStatus.COMPLETED;

                      return (
                        <ETableRow
                          key={task._id}
                          onClick={() => setSelectedTask(task)}
                          className={`cursor-pointer group ${
                            isDone ? "bg-[#faf8f4]/50 opacity-85" : ""
                          }`}
                        >
                          {/* Mark Complete Checkbox */}
                          <ETableCell className="pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              title={isDone ? "Mark as Incomplete" : "Mark as Completed"}
                              onClick={() => handleToggleStatus(task._id, isDone)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center mx-auto cursor-pointer transition-all shadow-2xs ${
                                isDone
                                  ? "bg-[#174824] border-[#174824] text-white"
                                  : "bg-[#fffdfa] border-[#8c7865]/70 hover:border-[#174824] text-transparent hover:text-[#174824]/40"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </ETableCell>

                          {/* Task Title & Description */}
                          <ETableCell>
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
                          </ETableCell>

                          {/* Module / Category Badge */}
                          <ETableCell nowrap>
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
                          </ETableCell>

                          {/* Assigned Devotees (To & By) */}
                          <ETableCell nowrap>
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
                          </ETableCell>

                          {/* Priority */}
                          <ETableCell nowrap>
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
                          </ETableCell>

                          {/* Due Date */}
                          <ETableCell nowrap>
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
                          </ETableCell>

                          {/* Actions */}
                          <ETableCell alignRight nowrap className="pr-6">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ESelect
                                trigger={<MoreVertical className="w-4 h-4" />}
                                align="end"
                                options={[
                                  {
                                    label: "View Details",
                                    value: "view",
                                    onClick: () => setSelectedTask(task),
                                  },
                                  {
                                    label: "Edit Task Details",
                                    value: "edit",
                                    onClick: () => openEditDrawer(task),
                                  },
                                  {
                                    label: isDone ? "Mark Incomplete" : "Mark Completed",
                                    value: "toggle_status",
                                    onClick: () => handleToggleStatus(task._id, isDone),
                                  },
                                  {
                                    label: "Delete",
                                    value: "delete",
                                    destructive: true,
                                    onClick: () => handleDeleteTask(task._id),
                                  },
                                ]}
                              />
                            </div>
                          </ETableCell>
                        </ETableRow>
                      );
                    })}
                  </ETableBody>
                </ETable>
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
                              handleToggleStatus(task._id, isDone);
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
        onEdit={openEditDrawer}
        onUpdated={fetchTasks}
      />

      {/* Linked Module Context Modal */}
      <EModal
        open={!!linkedModuleTask}
        onOpenChange={(open) => {
          if (!open) setLinkedModuleTask(null);
        }}
        size="md"
        title={
          linkedModuleTask?.moduleType === TaskModuleType.TRAVEL
            ? "Linked Travel Tour"
            : linkedModuleTask?.moduleType === TaskModuleType.MEETING
            ? "Linked Meeting"
            : "Linked Seva Module"
        }
        subtitle="Complete linked context & travel information"
        icon={
          linkedModuleTask?.moduleType === TaskModuleType.TRAVEL ? (
            <Plane className="w-5 h-5 text-[#174824]" />
          ) : linkedModuleTask?.moduleType === TaskModuleType.MEETING ? (
            <Users className="w-5 h-5 text-blue-700" />
          ) : (
            <CheckSquare className="w-5 h-5 text-[#174824]" />
          )
        }
      >
        {linkedModuleTask && (
          <div className="space-y-4 pt-1">
            {linkedModuleTask.moduleType === TaskModuleType.TRAVEL ? (
              <LinkedTravelCard
                travelId={linkedModuleTask.moduleRefId}
                fallbackTitle={linkedModuleTask.moduleTitle}
                onNavigate={() => setLinkedModuleTask(null)}
              />
            ) : (
              <ECard variant="sacred" className="p-4 space-y-3">
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
              </ECard>
            )}
          </div>
        )}
      </EModal>
    </SacredPortalLayout>
  );
}
