"use client";

import { useState } from "react";
import {
  Plane,
  Train,
  Car,
  Bus,
  CarTaxiFront,
  Navigation,
  Calendar,
  Building,
  User,
  FileText,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckSquare,
  Plus,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import CreateTaskDrawer from "@/components/task/CreateTaskDrawer";
import useTravel from "@/hooks/useTravel";
import useTasks from "@/hooks/useTasks";
import { usePermissions } from "@/hooks/usePermissions";
import { TransportMode, Travel, TravelStatus } from "@/types/travel";
import { Task, TaskModuleType, TaskStatus } from "@/types/task";

interface TravelApprovalDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travel: Travel | null;
  onSuccess?: () => void;
}

export default function TravelApprovalDrawer({
  open,
  onOpenChange,
  travel,
  onSuccess,
}: TravelApprovalDrawerProps) {
  const { updateTravelApproval, isSubmitting } = useTravel();
  const { isSuperAdmin } = usePermissions();
  const { tasks, fetchTasks, updateTaskStatus } = useTasks(
    travel?._id ? { moduleType: TaskModuleType.TRAVEL, moduleRefId: travel._id } : undefined
  );
  const [remarks, setRemarks] = useState("");
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  if (!travel) return null;

  const transport = travel.transportDetails?.[0] || { mode: TransportMode.FLIGHT };
  const approvalStatus = travel.approvalStatus || "PENDING";

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !remarks.trim()) {
      if (!confirm("Are you sure you want to reject without adding rejection remarks?")) {
        return;
      }
    }

    const success = await updateTravelApproval(travel._id, status, remarks.trim() || undefined);
    if (success) {
      setRemarks("");
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <EResponsiveDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isSuperAdmin ? "Travel Plan Review & Approval" : "Travel Plan Details"}
      description={
        isSuperAdmin
          ? "Review travel details, stay arrangements, and record approval decisions."
          : "View itinerary, transport, accommodation, and stay details."
      }
      size="lg"
    >
      <div className="space-y-4 pb-6">
        {/* Top Devotee & Status Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fbf8f2] border border-[#e5d9c3] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#174824] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-2xs">
              {travel.leaderId?.name ? travel.leaderId.name.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#174824]">Submitted By</p>
              <p className="text-sm font-bold text-[#2c221e] truncate">
                {travel.leaderId?.name || "Devotee"}
              </p>
              <p className="text-[11px] text-[#8c7865] truncate font-medium">
                {travel.leaderId?.email || ""} {travel.leaderId?.mobile ? `• ${travel.leaderId.mobile}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                approvalStatus === "APPROVED"
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                  : approvalStatus === "REJECTED"
                  ? "bg-red-100 text-red-900 border-red-300"
                  : "bg-amber-100 text-amber-950 border-amber-300"
              }`}
            >
              {approvalStatus === "APPROVED"
                ? "✓ Approved"
                : approvalStatus === "REJECTED"
                ? "✕ Rejected"
                : "⏳ Pending Approval"}
            </span>
            <span className="text-[10px] text-[#8c7865] font-semibold">
              Travel: {travel.status}
            </span>
          </div>
        </div>

        {/* Unified Travel Details Card */}
        <Card className="rounded-[22px] sm:rounded-3xl p-4 sm:p-5 border border-[#e5d9c3] bg-[#fffdfa] shadow-xs space-y-0 divide-y divide-[#e5d9c3]/70">
          {/* 1. Basic Details */}
          <div className="py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-[#174824]" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                Basic Details
              </p>
              <p className="text-sm font-bold text-[#2c221e] truncate">{travel.title}</p>
              <p className="text-xs text-[#5a4836] font-medium">
                {new Date(travel.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                &ndash;{" "}
                {new Date(travel.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-[11px] text-[#8c7865] font-medium">
                <span className="font-semibold text-[#174824]">{travel.fromLocation}</span> &rarr;{" "}
                <span className="font-semibold text-[#174824]">{travel.destinationCity}</span> &bull;{" "}
                {travel.purpose}
              </p>
            </div>
          </div>

          {/* 2. Transport */}
          <div className="py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
                {transport.mode === TransportMode.FLIGHT && <Plane className="w-4 h-4 text-amber-700" />}
                {transport.mode === TransportMode.TRAIN && <Train className="w-4 h-4 text-amber-700" />}
                {transport.mode === TransportMode.CAR && <Car className="w-4 h-4 text-amber-700" />}
                {transport.mode === TransportMode.PICKUP && <CarTaxiFront className="w-4 h-4 text-amber-700" />}
                {transport.mode === TransportMode.BUS && <Bus className="w-4 h-4 text-amber-700" />}
                {transport.mode === TransportMode.OTHER && <Navigation className="w-4 h-4 text-amber-700" />}
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                  Transport
                </p>
                <p className="text-sm font-bold text-[#2c221e]">
                  {transport.mode} Transit
                </p>
                {transport.airline && (
                  <p className="text-xs text-[#5a4836] font-medium truncate">
                    {transport.airline} &ndash; {transport.flightNo}{" "}
                    {transport.seatPreference && `(${transport.seatPreference})`}
                  </p>
                )}
                {transport.trainNameNo && (
                  <p className="text-xs text-[#5a4836] font-medium truncate">
                    {transport.trainNameNo} {transport.coachSeat && `• Seat: ${transport.coachSeat}`}
                  </p>
                )}
                {transport.cabProvider && (
                  <p className="text-xs text-[#5a4836] font-medium truncate">
                    {transport.cabProvider} • Driver: {transport.driverPhone || "Assigned"}
                  </p>
                )}
                {transport.departureTime && (
                  <p className="text-[11px] text-[#8c7865]">
                    Dep: {new Date(transport.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Arr: {new Date(transport.arrivalTime || travel.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>

            {transport.pnr && (
              <span className="text-xs font-mono font-bold text-[#174824] bg-[#faf5eb] px-2 py-0.5 rounded border border-[#e5d9c3] flex-shrink-0">
                PNR: {transport.pnr}
              </span>
            )}
          </div>

          {/* 3. Stay Details */}
          <div className="py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Building className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                  Stay Arrangements
                </p>
                <p className="text-sm font-bold text-[#2c221e] truncate">
                  {travel.stayDetails?.name || "Temple Guest House"}
                </p>
                <p className="text-xs text-[#5a4836] truncate">
                  {travel.stayDetails?.address || travel.destinationCity}
                </p>
                {travel.stayDetails?.checkIn && (
                  <p className="text-[11px] text-[#8c7865]">
                    Check-in: {new Date(travel.stayDetails.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • Check-out: {new Date(travel.stayDetails.checkOut || travel.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            </div>

            {travel.stayDetails?.bookingRef && (
              <span className="text-[11px] font-mono text-[#5a4836] bg-[#faf5eb] px-1.5 py-0.5 rounded border border-[#e5d9c3] flex-shrink-0">
                Ref: {travel.stayDetails.bookingRef}
              </span>
            )}
          </div>

          {/* 4. Local Contacts */}
          <div className="py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                Local Contacts ({travel.localContacts?.length || 0})
              </p>
              {travel.localContacts && travel.localContacts.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {travel.localContacts.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-[#faf5eb] border border-[#e5d9c3] text-[#5a4836] px-2.5 py-1 rounded-lg font-medium"
                    >
                      <strong className="text-[#174824]">{c.name}</strong> ({c.role}) • {c.phone}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8c7865]">No contacts specified</p>
              )}
            </div>
          </div>

          {/* 5. Special Notes */}
          <div className="py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] text-[#174824] flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 space-y-0.5 flex-1">
              <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                Devotee Notes
              </p>
              <p className="text-xs text-[#2c221e] italic font-medium">
                {travel.specialInstructions || travel.generalNotes || "No special instructions provided."}
              </p>
            </div>
          </div>
        </Card>

        {/* Seva Tasks Section (Visible on Approved plans) */}
        {approvalStatus === "APPROVED" && (
          <div className="p-4 rounded-2xl bg-[#fffdfa] border border-[#e5d9c3] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#174824] uppercase tracking-wider">
                <CheckSquare className="w-4 h-4 text-emerald-800" />
                <span>Seva Tasks ({tasks.length})</span>
              </div>
              {isSuperAdmin && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsAssignTaskOpen(true);
                  }}
                  className="h-7 px-2.5 rounded-lg bg-[#174824] text-white text-[11px] font-bold gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-300" />
                  <span>Assign Seva Task</span>
                </Button>
              )}
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-[#8c7865] italic py-1">
                No seva tasks assigned for this tour yet.
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((t) => {
                  const isDone = t.status === TaskStatus.COMPLETED;
                  return (
                    <div
                      key={t._id}
                      className="p-2.5 rounded-xl bg-[#faf5eb] border border-[#e5d9c3] flex items-center justify-between gap-2.5 hover:border-[#174824]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateTaskStatus(
                              t._id,
                              isDone ? TaskStatus.PENDING : TaskStatus.COMPLETED
                            )
                          }
                          className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${
                            isDone
                              ? "bg-[#174824] border-[#174824] text-white"
                              : "bg-white border-[#8c7865] hover:border-[#174824]"
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3" />}
                        </button>
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => {
                            setTaskToEdit(t);
                            setIsAssignTaskOpen(true);
                          }}
                        >
                          <p
                            className={`text-xs font-bold truncate ${
                              isDone ? "line-through text-[#8c7865]" : "text-[#2c221e]"
                            }`}
                          >
                            {t.title}
                          </p>
                          <p className="text-[10px] text-[#8c7865] font-medium">
                            Sevak: <strong className="text-[#174824]">{t.assignedTo?.name}</strong> &bull; {t.priority}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-amber-100 text-amber-900 border-amber-300"
                          }`}
                        >
                          {isDone ? "Done" : "Pending"}
                        </span>

                        <button
                          type="button"
                          title="Edit Task"
                          onClick={() => {
                            setTaskToEdit(t);
                            setIsAssignTaskOpen(true);
                          }}
                          className="p-1 rounded-lg text-[#8c7865] hover:text-[#174824] hover:bg-[#faf5eb] border border-transparent hover:border-[#e5d9c3] cursor-pointer transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Existing Decision Audit Log (if already decided) */}
        {travel.approvalRemarks && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <p className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Decision Remarks:</span>
            </p>
            <p className="text-amber-900 font-medium pl-5">{travel.approvalRemarks}</p>
            {travel.approvedBy && (
              <p className="text-[10px] text-amber-800/80 pl-5 font-semibold">
                By: {travel.approvedBy.name} on {new Date(travel.approvedAt || "").toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Decision & Action Controls: Admin Only vs Regular Devotee View */}
        {!isSuperAdmin ? (
          /* Regular User / Devotee: Read-only Status Banner */
          <div className="pt-2">
            {approvalStatus === "APPROVED" ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="text-xs font-bold">This travel plan is Approved and scheduled.</span>
              </div>
            ) : approvalStatus === "REJECTED" ? (
              <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 flex items-center gap-2.5 text-red-900">
                <XCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                <span className="text-xs font-bold">This travel plan was Rejected by temple administration.</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-2.5 text-amber-900">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span className="text-xs font-bold">Your travel request has been submitted and is pending admin review.</span>
              </div>
            )}
          </div>
        ) : (
          /* Super Admin Controls */
          approvalStatus === "REJECTED" ? (
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <XCircle className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-red-900">
                This Travel Plan has been Rejected
              </p>
              <p className="text-[11px] text-red-700/90 font-medium">
                No further approval actions can be taken for this request.
              </p>
            </div>
          ) : approvalStatus === "APPROVED" ? (
            <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-amber-500/20 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold">This plan is currently Approved</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                  Reason for Revocation / Rejection
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Specify reason to revoke approval or cancel plan..."
                  className="w-full text-xs font-medium text-[#2c221e] bg-[#faf5eb]/70 rounded-xl border border-[#e5d9c3] focus:border-red-500 outline-none p-2.5 placeholder:text-[#8c7865]/60 transition-all resize-none"
                />
              </div>

              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecision("REJECTED")}
                className="w-full rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold h-10 cursor-pointer gap-1.5 shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Revoke Approval & Reject Plan</span>
              </Button>
            </div>
          ) : (
            /* PENDING APPROVAL - Show Both Options to Admin */
            <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-[#174824]/20 space-y-3 shadow-xs">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#174824] uppercase tracking-wider">
                  Approval / Rejection Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add approval clearance notes or instructions..."
                  className="w-full text-xs font-medium text-[#2c221e] bg-[#faf5eb]/70 rounded-xl border border-[#e5d9c3] focus:border-[#174824] outline-none p-2.5 placeholder:text-[#8c7865]/60 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDecision("REJECTED")}
                  variant="outline"
                  className="flex-1 rounded-xl border-red-300 bg-red-50/50 hover:bg-red-100 text-red-700 text-xs font-bold h-11 cursor-pointer gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Plan</span>
                </Button>

                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDecision("APPROVED")}
                  className="flex-1 rounded-xl bg-[#174824] hover:bg-[#174824]/90 text-white text-xs font-bold h-11 cursor-pointer gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Approve Plan</span>
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      <CreateTaskDrawer
        open={isAssignTaskOpen}
        onOpenChange={(isOpen) => {
          setIsAssignTaskOpen(isOpen);
          if (!isOpen) setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        initialModuleType={TaskModuleType.TRAVEL}
        initialModuleRefId={travel._id}
        initialModuleTitle={`${travel.title} (${travel.fromLocation} → ${travel.destinationCity})`}
        onSuccess={() => {
          setTaskToEdit(null);
          fetchTasks();
        }}
      />
    </EResponsiveDrawer>
  );
}
