"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Plane,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Building,
  User,
  Phone,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  CheckSquare,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import apiNexus from "@/lib/api/apiNexusIntercepter";
import { Travel, TravelTask, TaskStatus, TaskPriority } from "@/types/travel";
import { toast } from "sonner";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TravelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const travelId = params.id as string;

  const [travel, setTravel] = useState<Travel | null>(null);
  const [tasks, setTasks] = useState<TravelTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Expense Modal State
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("TRANSPORT");
  const [expenseAmount, setExpenseAmount] = useState<number>(500);

  // Task Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  const fetchTravelData = useCallback(async () => {
    if (!travelId) return;
    setIsLoading(true);
    try {
      const [travelRes, tasksRes] = await Promise.all([
        apiNexus.call<Travel>("GET_TRAVEL_BY_ID", { params: { id: travelId } }),
        apiNexus.call<TravelTask[]>("GET_TRAVEL_TASKS", { params: { id: travelId } }),
      ]);

      if (travelRes.isSuccess && travelRes.data) {
        setTravel(travelRes.data);
      }
      if (tasksRes.isSuccess && Array.isArray(tasksRes.data)) {
        setTasks(tasksRes.data);
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

  const handleAddExpense = async () => {
    if (!expenseTitle.trim() || !expenseAmount) return;
    try {
      const response = await apiNexus.call<Travel>("POST_ADD_TRAVEL_EXPENSE", {
        params: { id: travelId },
        payload: {
          title: expenseTitle,
          category: expenseCategory,
          amount: expenseAmount,
          currency: "INR",
        },
      });

      if (response.isSuccess) {
        toast.success("Expense added to travel!");
        setExpenseModalOpen(false);
        fetchTravelData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense.");
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      const response = await apiNexus.call<TravelTask>("POST_CREATE_TRAVEL_TASK", {
        params: { id: travelId },
        payload: {
          title: taskTitle,
          priority: taskPriority,
        },
      });

      if (response.isSuccess) {
        toast.success("Task assigned to travel!");
        setTaskModalOpen(false);
        fetchTravelData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create task.");
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    try {
      const response = await apiNexus.call<TravelTask>("PATCH_UPDATE_TRAVEL_TASK", {
        params: { taskId },
        payload: { status: newStatus },
      });

      if (response.isSuccess) {
        toast.success(`Task marked as ${newStatus}`);
        fetchTravelData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update task.");
    }
  };

  if (isLoading || !travel) {
    return (
      <SacredPortalLayout>
        <Skeleton className="h-44 w-full rounded-[24px] bg-[#e5d9c3]/60" />
        <Skeleton className="h-64 w-full rounded-[24px] bg-[#e5d9c3]/60" />
      </SacredPortalLayout>
    );
  }

  const totalExpenses = travel.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  return (
    <SacredPortalLayout>
      {/* Back Link */}
      <button
        type="button"
        onClick={() => router.push("/travel")}
        className="flex items-center gap-1.5 text-xs font-bold text-[#174824] hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Travel Listing</span>
      </button>

      {/* Main Header Banner */}
      <Card className="rounded-[24px] sm:rounded-[28px] border border-[#e5d9c3] bg-[#faf4e8] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#174824]">{travel.title}</h2>
              <Badge className="bg-[#174824] text-amber-200 text-xs font-bold">{travel.status}</Badge>
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
      </Card>

      {/* Transport & Accommodation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transport Card */}
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#e5d9c3]/60 pb-3">
            <Plane className="w-5 h-5 text-[#174824]" />
            <h3 className="text-base font-bold text-[#174824]">Transport & Transit Details</h3>
          </div>

          {travel.transportDetails?.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3] space-y-1 text-xs">
              <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-900 bg-amber-50">
                {t.mode}
              </Badge>
              <p className="font-bold text-[#2c221e]">
                {t.flightNo || t.trainNo || t.vehicleNo || "Transit Details"}
              </p>
              {t.pnr && <p className="text-[#5a4836]">PNR: {t.pnr}</p>}
            </div>
          ))}
        </Card>

        {/* Stay & Local Contacts */}
        <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#e5d9c3]/60 pb-3">
            <Building className="w-5 h-5 text-[#174824]" />
            <h3 className="text-base font-bold text-[#174824]">Stay & Accommodation</h3>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-[#2c221e] text-sm">{travel.stayDetails?.name || "Temple Guest House"}</p>
            <p className="text-[#5a4836]">{travel.stayDetails?.address}</p>
            {travel.stayDetails?.contactPersonName && (
              <p className="text-[#174824] font-semibold">
                Contact: {travel.stayDetails.contactPersonName} ({travel.stayDetails.contactPersonPhone})
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Embedded Contextual Expenses Section */}
      <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5d9c3]/60 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-[#174824]">Contextual Travel Expenses</h3>
          </div>
          <Button
            size="sm"
            onClick={() => setExpenseModalOpen(true)}
            className="bg-[#174824] text-white rounded-xl text-xs font-bold gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Expense
          </Button>
        </div>

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
      </Card>

      {/* Travel Tasks Integration Section */}
      <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5d9c3]/60 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#174824]" />
            <h3 className="text-base font-bold text-[#174824]">Travel Tasks & Checklist</h3>
          </div>
          <Button
            size="sm"
            onClick={() => setTaskModalOpen(true)}
            className="bg-[#174824] text-white rounded-xl text-xs font-bold gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Assign Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-[#5a4836]">No tasks assigned to this travel record.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => handleToggleTaskStatus(task._id, task.status)}
                className="p-3.5 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3] flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === TaskStatus.COMPLETED}
                    readOnly
                    className="w-4 h-4 accent-[#174824]"
                  />
                  <div>
                    <p className={`font-bold ${task.status === TaskStatus.COMPLETED ? "line-through text-[#8c7865]" : "text-[#2c221e]"}`}>
                      {task.title}
                    </p>
                    <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-900">
                      {task.priority} Priority
                    </Badge>
                  </div>
                </div>
                <Badge className={task.status === TaskStatus.COMPLETED ? "bg-emerald-700 text-white text-[10px]" : "bg-amber-100 text-amber-900 text-[10px]"}>
                  {task.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Expense Modal */}
      <Dialog open={expenseModalOpen} onOpenChange={setExpenseModalOpen}>
        <DialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#174824]">Add Contextual Travel Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input label="Expense Title" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} placeholder="e.g. Flight Ticket / Cab Fare" />
            <Input type="number" label="Amount (₹)" value={expenseAmount} onChange={(e) => setExpenseAmount(Number(e.target.value))} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddExpense} className="bg-[#174824] text-white rounded-xl">Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Modal */}
      <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#174824]">Assign Travel Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input label="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Confirm Flight Seat Assignment" />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTask} className="bg-[#174824] text-white rounded-xl">Assign Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SacredPortalLayout>
  );
}
