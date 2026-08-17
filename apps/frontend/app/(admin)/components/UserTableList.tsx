"use client";

import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Mail,
  Phone,
  Building2,
  UserCircle,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User, UserStatus } from "@/types/auth";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface UserTableListProps {
  users: User[];
  type: "pending" | "rejected";
  isLoading: boolean;
  isUpdating: string | null;
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
}

export default function UserTableList({
  users,
  type,
  isLoading,
  isUpdating,
  updateUserStatus,
}: UserTableListProps) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full bg-[#e5d9c3]/60" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px] bg-[#e5d9c3]/60" />
              <Skeleton className="h-3 w-[150px] bg-[#e5d9c3]/40" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg bg-[#e5d9c3]/60" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="p-4 rounded-full bg-[#174824]/5 mb-3">
          <Users className="w-12 h-12 text-[#174824]/40" />
        </div>
        <h3 className="text-lg font-bold text-[#174824] mb-1">
          {type === "pending" ? "No Pending Requests" : "No Rejected Accounts"}
        </h3>
        <p className="text-xs sm:text-sm text-[#5a4836] max-w-sm font-medium">
          {type === "pending"
            ? "All account registration requests have been reviewed. New registration requests will appear here."
            : "No user accounts are currently rejected."}
        </p>
        <div className="relative w-6 h-6 mt-4 opacity-60">
          <Image
            src="/assests/flower-icon.png"
            alt="Lotus"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto relative z-10">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#e5d9c3] bg-[#faf4e8]/80 hover:bg-[#faf4e8]/80">
              <TableHead className="text-[#5a4836] font-bold text-xs uppercase tracking-wider pl-6 py-3.5">
                User Profile
              </TableHead>
              <TableHead className="text-[#5a4836] font-bold text-xs uppercase tracking-wider">
                Contact Details
              </TableHead>
              <TableHead className="text-[#5a4836] font-bold text-xs uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead className="text-[#5a4836] font-bold text-xs uppercase tracking-wider">
                Temple / Center
              </TableHead>
              <TableHead className="text-[#5a4836] font-bold text-xs uppercase tracking-wider">
                Requested Date
              </TableHead>
              <TableHead className="text-[#5a4836] font-bold text-xs uppercase tracking-wider text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                className="border-b border-[#e5d9c3]/50 hover:bg-[#fcfaf5] transition-colors"
              >
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <span className="text-sm font-bold text-[#174824]">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-[#2c221e] text-sm">
                        {user.name}
                      </p>
                      {type === "pending" ? (
                        <Badge
                          variant="outline"
                          className="mt-0.5 text-[10px] px-2 py-0.5 border-amber-300 text-amber-800 bg-amber-50/90 font-semibold"
                        >
                          <Clock className="w-2.5 h-2.5 mr-1 text-amber-600" />
                          Pending Approval
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="mt-0.5 text-[10px] px-2 py-0.5 border-red-300 text-red-800 bg-red-50/90 font-semibold"
                        >
                          <XCircle className="w-2.5 h-2.5 mr-1 text-red-600" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs text-[#5a4836] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#5a4836]/60" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#5a4836]/60" />
                      <span>{user.mobile}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-[#174824]/10 text-[#174824] border-0 font-semibold px-2.5 py-0.5"
                  >
                    <UserCircle className="w-3.5 h-3.5 mr-1 text-[#174824]" />
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-[#5a4836] font-medium">
                    <Building2 className="w-3.5 h-3.5 text-[#5a4836]/60" />
                    <span>{user.temple?.name || "Not specified"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-[#5a4836] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#5a4836]/60" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <ActionButtons
                      userId={user._id}
                      userName={user.name}
                      type={type}
                      isUpdating={isUpdating}
                      updateUserStatus={updateUserStatus}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-[#e5d9c3]/50 relative z-10">
        {users.map((user) => (
          <div key={user._id} className="p-4 space-y-3 bg-[#faf4e8]/60">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-bold text-[#174824]">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-[#2c221e] text-sm">
                    {user.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-0.5 text-[10px] px-1.5 py-0 bg-[#174824]/10 text-[#174824] border-0 font-semibold"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
              {type === "pending" ? (
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 border-amber-300 text-amber-800 bg-amber-50 font-semibold"
                >
                  <Clock className="w-2.5 h-2.5 mr-1" />
                  Pending
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 border-red-300 text-red-800 bg-red-50 font-semibold"
                >
                  <XCircle className="w-2.5 h-2.5 mr-1" />
                  Rejected
                </Badge>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-[#5a4836] font-medium pl-[52px]">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5a4836]/60" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5a4836]/60" />
                <span>{user.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5a4836]/60" />
                <span>{user.temple?.name || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5a4836]/60" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-[52px] pt-1">
              <ActionButtons
                userId={user._id}
                userName={user.name}
                type={type}
                isUpdating={isUpdating}
                updateUserStatus={updateUserStatus}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Reusable Sacred Action Buttons Component ─── */
interface ActionButtonsProps {
  userId: string;
  userName: string;
  type: "pending" | "rejected";
  isUpdating: string | null;
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
}

function ActionButtons({
  userId,
  userName,
  type,
  isUpdating,
  updateUserStatus,
}: ActionButtonsProps) {
  const isThisUpdating = isUpdating === userId;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            disabled={isThisUpdating}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl text-xs font-semibold gap-1.5 px-3.5 h-8.5 shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{type === "rejected" ? "Re-Approve" : "Approve"}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl p-6 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#174824] flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="w-6 h-6 text-[#174824]" />
              <span>
                {type === "rejected"
                  ? "Re-Approve User Account?"
                  : "Approve User Account?"}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#5a4836] text-sm pt-2">
              Are you sure you want to grant system access to{" "}
              <span className="font-bold text-[#2c221e]">{userName}</span>? Once
              approved, they will be able to log in immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel className="rounded-xl border-[#e5d9c3] text-[#5a4836] hover:bg-[#e5d9c3]/30 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateUserStatus(userId, UserStatus.APPROVED)}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-semibold cursor-pointer"
            >
              Yes, Approve Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {type === "pending" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isThisUpdating}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 rounded-xl text-xs font-semibold gap-1.5 px-3.5 h-8.5 transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl p-6 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-800 flex items-center gap-2 text-xl font-bold">
                <ShieldAlert className="w-6 h-6 text-red-700" />
                <span>Reject Account Request?</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#5a4836] text-sm pt-2">
                Are you sure you want to reject{" "}
                <span className="font-bold text-[#2c221e]">{userName}</span>
                &apos;s registration request? They will be blocked from logging in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4">
              <AlertDialogCancel className="rounded-xl border-[#e5d9c3] text-[#5a4836] hover:bg-[#e5d9c3]/30 cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => updateUserStatus(userId, UserStatus.REJECTED)}
                className="bg-red-700 hover:bg-red-800 text-white rounded-xl font-semibold cursor-pointer"
              >
                Yes, Reject Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
