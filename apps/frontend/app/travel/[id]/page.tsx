"use client";

import {
  Plane,
  Calendar,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Building,
  DollarSign,
  Plus,
  CheckSquare,
  Crown,
  Users,
  Paperclip,
} from "lucide-react";
import S3Uploader from "@/components/common/S3Uploader";
import EButton from "@/components/common/EButton";
import ECard from "@/components/common/ECard";
import EInput from "@/components/common/EInput";
import ESelect from "@/components/common/ESelect";
import ESkeleton from "@/components/common/ESkeleton";
import EModal from "@/components/common/EModal";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import CreateTaskDrawer from "@/components/task/CreateTaskDrawer";
import TaskDetailDrawer from "@/components/task/TaskDetailDrawer";
import useTravelDetail from "@/hooks/travel/useTravelDetail";
import { TravelCategory } from "@/types/travel";
import { TaskModuleType, TaskStatus } from "@/types/task";

export default function TravelDetailPage() {
  const {
    travelId,
    travel,
    isLoading,
    totalExpenses,
    router,

    // Tasks
    tasks,
    fetchTasks,
    updateTaskStatus,
    isTaskDrawerOpen,
    setIsTaskDrawerOpen,
    selectedTask,
    setSelectedTask,
    taskToEdit,
    setTaskToEdit,

    // Expenses
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
  } = useTravelDetail();

  if (isLoading || !travel) {
    return (
      <SacredPortalLayout showGreeting={false}>
        <div className="space-y-6">
          <ESkeleton variant="card" height={160} className="w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ESkeleton variant="card" height={220} className="w-full" />
            <ESkeleton variant="card" height={220} className="w-full" />
          </div>
          <ESkeleton variant="card" height={200} className="w-full" />
          <ESkeleton variant="card" height={200} className="w-full" />
        </div>
      </SacredPortalLayout>
    );
  }

  return (
    <SacredPortalLayout showGreeting={false}>
      {/* Back Link */}
      <div>
        <EButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/travel")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-[#174824] hover:text-[#12391c] font-bold px-0 hover:bg-transparent hover:underline cursor-pointer"
        >
          Back to Travel Listing
        </EButton>
      </div>

      {/* Main Header Banner */}
      <ECard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-[#174824]">{travel.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#174824] text-amber-200 text-xs font-bold leading-none">{travel.status}</span>
              {travel.category === TravelCategory.MAHARAJ_JI ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-300 bg-amber-50 text-amber-900 inline-flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>Maharaj Ji</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#174824]/20 bg-[#174824]/5 text-[#174824] inline-flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#174824]" />
                  <span>General</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#5a4836] font-medium">{travel.purpose}</p>
          </div>

          <div className="text-right space-y-1">
            <p className="text-xs font-bold text-[#8c7865] uppercase">Total Expenses</p>
            <p className="text-2xl font-bold text-emerald-800">₹{totalExpenses.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-[#e5d9c3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#2c221e]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#174824]" />
            <span>From: {travel.fromLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Destination: {travel.destinationCity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</span>
          </div>
        </div>
      </ECard>

      {/* Transport & Accommodation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transport Card */}
        <ECard
          title="Transport & Transit Details"
          icon={<Plane className="w-5 h-5 text-[#174824]" />}
          headerDivider
        >
          {travel.transportDetails?.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3] space-y-1 text-xs">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-300 text-amber-900 bg-amber-50">
                {t.mode}
              </span>
              <p className="font-bold text-[#2c221e]">
                {t.flightNo || t.trainNo || t.vehicleNo || "Transit Details"}
              </p>
              {t.pnr && <p className="text-[#5a4836]">PNR: {t.pnr}</p>}
            </div>
          ))}
        </ECard>

        {/* Stay & Local Contacts */}
        <ECard
          title="Stay & Accommodation"
          icon={<Building className="w-5 h-5 text-[#174824]" />}
          headerDivider
        >
          <div className="space-y-2 text-xs">
            <p className="font-bold text-[#2c221e] text-sm">{travel.stayDetails?.name || "Temple Guest House"}</p>
            <p className="text-[#5a4836]">{travel.stayDetails?.address}</p>
            {travel.stayDetails?.contactPersonName && (
              <p className="text-[#174824] font-semibold">
                Contact: {travel.stayDetails.contactPersonName} ({travel.stayDetails.contactPersonPhone})
              </p>
            )}
          </div>
        </ECard>
      </div>

      {/* Attached Documents */}
      {travel.attachments && travel.attachments.length > 0 && (
        <ECard
          title={`Attached Documents (${travel.attachments.length})`}
          icon={<Paperclip className="w-5 h-5 text-[#174824]" />}
          headerDivider
        >
          <S3Uploader files={travel.attachments} viewOnly />
        </ECard>
      )}

      {/* Embedded Contextual Expenses Section */}
      <ECard
        title="Contextual Travel Expenses"
        icon={<DollarSign className="w-5 h-5 text-emerald-800" />}
        headerDivider
        headerAction={
          <EButton
            size="sm"
            variant="sacred-primary"
            onClick={() => setExpenseModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Expense
          </EButton>
        }
      >
        {travel.expenses?.length === 0 ? (
          <p className="text-xs text-[#5a4836]">No travel expenses logged yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {travel.expenses?.map((e, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#2c221e]">{e.title}</p>
                  <p className="text-[11px] text-[#8c7865]">{e.category}</p>
                </div>
                <p className="font-bold text-emerald-800">₹{e.amount}</p>
              </div>
            ))}
          </div>
        )}
      </ECard>

      {/* Travel Tasks Integration Section */}
      <ECard
        title={`Travel Tasks & Seva (${tasks.length})`}
        icon={<CheckSquare className="w-5 h-5 text-[#174824]" />}
        headerDivider
        headerAction={
          <EButton
            size="sm"
            variant="sacred-primary"
            onClick={() => setIsTaskDrawerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-amber-300" />}
          >
            Assign Seva Task
          </EButton>
        }
      >

        {tasks.length === 0 ? (
          <p className="text-xs text-[#5a4836] italic">No tasks assigned to this travel tour yet. Click &quot;Assign Seva Task&quot; to delegate duties.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const isDone = task.status === TaskStatus.COMPLETED;
              return (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  className="p-3.5 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3] flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(
                          task._id,
                          isDone ? TaskStatus.PENDING : TaskStatus.COMPLETED
                        );
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                        isDone
                          ? "bg-[#174824] border-[#174824] text-white"
                          : "bg-white border-[#8c7865] hover:border-[#174824]"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`font-bold truncate ${isDone ? "line-through text-[#8c7865]" : "text-[#2c221e]"}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-[#8c7865] font-medium truncate">
                        Assigned to: <strong className="text-[#174824]">{task.assignedTo?.name}</strong> • {task.priority}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                    }`}
                  >
                    {isDone ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </ECard>

      {/* Add Expense Modal */}
      <EModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        title="Add Contextual Travel Expense"
        subtitle="Record expenses directly linked to this spiritual tour"
        icon={<DollarSign className="w-5 h-5 text-emerald-800" />}
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <EButton
              variant="outline"
              size="sm"
              onClick={() => setExpenseModalOpen(false)}
              disabled={isSubmittingExpense}
            >
              Cancel
            </EButton>
            <EButton
              variant="sacred-primary"
              size="sm"
              onClick={handleAddExpense}
              isLoading={isSubmittingExpense}
              loadingText="Adding..."
            >
              Add Expense
            </EButton>
          </div>
        }
      >
        <div className="space-y-3.5 py-1">
          <EInput
            label="Expense Title"
            required
            value={expenseTitle}
            onChange={(e) => setExpenseTitle(e.target.value)}
            placeholder="e.g. Flight Ticket / Cab Fare / Prasadam"
          />
          <ESelect
            label="Category"
            value={expenseCategory}
            onChange={(val) => setExpenseCategory(val)}
            options={[
              { value: "TRANSPORT", label: "Transport" },
              { value: "ACCOMMODATION", label: "Accommodation" },
              { value: "PRASADAM", label: "Prasadam / Food" },
              { value: "SEVA_SUPPLIES", label: "Seva Supplies" },
              { value: "MISC", label: "Miscellaneous" },
            ]}
          />
          <EInput
            type="number"
            label="Amount (₹)"
            required
            value={expenseAmount || ""}
            onChange={(e) => setExpenseAmount(Number(e.target.value))}
            min={1}
          />
        </div>
      </EModal>

      {/* Unified Create / Edit Task Drawer */}
      <CreateTaskDrawer
        open={isTaskDrawerOpen}
        onOpenChange={(open) => {
          setIsTaskDrawerOpen(open);
          if (!open) setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        initialModuleType={TaskModuleType.TRAVEL}
        initialModuleRefId={travelId}
        initialModuleTitle={travel ? `${travel.title} (${travel.fromLocation} → ${travel.destinationCity})` : "Travel Tour"}
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
          setIsTaskDrawerOpen(true);
        }}
        onUpdated={() => {
          fetchTasks();
        }}
      />
    </SacredPortalLayout>
  );
}
