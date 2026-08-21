"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Clock,
  XCircle,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Calendar,
  UserCircle,
  Users,
  ShieldAlert,
  ShieldCheck,
  Settings2,
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
import { User, UserRole, UserStatus } from "@/types/auth";
import ApproveUserDrawer from "./ApproveUserDrawer";

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

function StatusBadge({ status }: { status: string }) {
  if (status === UserStatus.APPROVED) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-2 py-0.5 border-emerald-300 text-emerald-800 bg-emerald-50/90 font-semibold"
      >
        <ShieldCheck className="w-2.5 h-2.5 mr-1 text-emerald-600" />
        Approved
      </Badge>
    );
  }
  if (status === UserStatus.BLOCKED) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-2 py-0.5 border-rose-300 text-rose-800 bg-rose-50/90 font-semibold"
      >
        <ShieldAlert className="w-2.5 h-2.5 mr-1 text-rose-600" />
        Blocked
      </Badge>
    );
  }
  if (status === UserStatus.REJECTED) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-2 py-0.5 border-red-300 text-red-800 bg-red-50/90 font-semibold"
      >
        <XCircle className="w-2.5 h-2.5 mr-1 text-red-600" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-[10px] px-2 py-0.5 border-amber-300 text-amber-800 bg-amber-50/90 font-semibold"
    >
      <Clock className="w-2.5 h-2.5 mr-1 text-amber-600" />
      Pending Approval
    </Badge>
  );
}

interface UserTableListProps {
  users: User[];
  type: "all" | "pending" | "rejected";
  isLoading: boolean;
  isUpdating: string | null;
  updateUserStatus: (
    userId: string,
    status: UserStatus,
    role?: string,
    permissions?: Record<string, Record<string, boolean>>,
  ) => Promise<void>;
}

export default function UserTableList({
  users,
  type,
  isLoading,
  isUpdating,
  updateUserStatus,
}: UserTableListProps) {
  const [selectedUserForApproval, setSelectedUserForApproval] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenApproveDrawer = (user: User) => {
    setSelectedUserForApproval(user);
    setIsDrawerOpen(true);
  };

  const handleConfirmApproval = async (userId: string, role: string, permissions: any) => {
    await updateUserStatus(userId, UserStatus.APPROVED, role, permissions);
    setIsDrawerOpen(false);
    setSelectedUserForApproval(null);
  };

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
          {type === "pending"
            ? "No Pending Requests"
            : type === "rejected"
            ? "No Rejected Accounts"
            : "No Users Found"}
        </h3>
        <p className="text-xs sm:text-sm text-[#5a4836] max-w-sm font-medium">
          {type === "pending"
            ? "All account registration requests have been reviewed. New registration requests will appear here."
            : type === "rejected"
            ? "No rejected registration requests found."
            : "No user records found in the community database."}
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
                Date
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
                    <div className="w-10 h-10 rounded-full bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden relative">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name || "User Avatar"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#174824]">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#2c221e] text-sm">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <StatusBadge status={user.status} />

                        {/* Registration Type / Auth Provider Badge */}
                        {user.authProvider === "GOOGLE" || user.googleId ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 border-blue-200/90 text-blue-800 bg-blue-50/90 font-semibold flex items-center gap-1"
                          >
                            <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Google</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 border-[#e5d9c3] text-[#5a4836] bg-[#fbf8f0] font-semibold"
                          >
                            Direct Form
                          </Badge>
                        )}
                      </div>
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
                      <span>{user.mobile || "—"}</span>
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
                      user={user}
                      isUpdating={isUpdating}
                      updateUserStatus={updateUserStatus}
                      onApproveClick={handleOpenApproveDrawer}
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
                <div className="w-10 h-10 rounded-full bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-base font-bold text-[#174824]">
                      {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#2c221e] text-sm">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-[#174824]/10 text-[#174824] border-0 font-semibold"
                    >
                      {user.role}
                    </Badge>

                    {/* Registration Type Badge (Mobile) */}
                    {user.authProvider === "GOOGLE" || user.googleId ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-blue-200 text-blue-800 bg-blue-50/90 font-semibold flex items-center gap-1"
                      >
                        <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-[#e5d9c3] text-[#5a4836] bg-[#fbf8f0] font-semibold"
                      >
                        Direct Form
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <StatusBadge status={user.status} />
            </div>

            <div className="space-y-1 text-xs text-[#5a4836] font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5a4836]/60 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5a4836]/60 flex-shrink-0" />
                <span>{user.mobile || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5a4836]/60 flex-shrink-0" />
                <span>{user.temple?.name || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5a4836]/60 flex-shrink-0" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e5d9c3]/40">
              <ActionButtons
                user={user}
                isUpdating={isUpdating}
                updateUserStatus={updateUserStatus}
                onApproveClick={handleOpenApproveDrawer}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Role & Permissions Approval Drawer */}
      <ApproveUserDrawer
        user={selectedUserForApproval}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUserForApproval(null);
        }}
        isUpdating={isUpdating === selectedUserForApproval?._id}
        onConfirmApproval={handleConfirmApproval}
      />
    </>
  );
}

/* ─── Reusable Action Buttons Component ─── */
interface ActionButtonsProps {
  user: User;
  isUpdating: string | null;
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  onApproveClick: (user: User) => void;
}

function ActionButtons({
  user,
  isUpdating,
  updateUserStatus,
  onApproveClick,
}: ActionButtonsProps) {
  const isThisUpdating = isUpdating === user._id;
  const isPending = user.status === UserStatus.PENDING_APPROVAL;
  const isApproved = user.status === UserStatus.APPROVED;
  const isBlocked = user.status === UserStatus.BLOCKED;
  const isRejected = user.status === UserStatus.REJECTED;

  const userRoleStr = (user.role as string) || "";
  const isSuperAdminUser =
    userRoleStr === "Super Admin" ||
    userRoleStr === "Super Administrator" ||
    user.email === "admin@samanvaya.com";

  return (
    <>
      {/* 1. If Approved: Edit Permissions & Block */}
      {isApproved && (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={isThisUpdating}
            onClick={() => onApproveClick(user)}
            className="border-[#174824]/30 text-[#174824] hover:bg-[#174824]/10 rounded-xl text-xs font-semibold gap-1.5 px-3 h-8.5 transition-all cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#174824]" />
            <span>Edit Permissions</span>
          </Button>

          {!isSuperAdminUser && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isThisUpdating}
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl text-xs font-semibold gap-1.5 px-3 h-8.5 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Block</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl p-6 shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-rose-800 flex items-center gap-2 text-xl font-bold">
                    <ShieldAlert className="w-6 h-6 text-rose-700" />
                    <span>Block User Account?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[#5a4836] text-sm pt-2">
                    Are you sure you want to block{" "}
                    <span className="font-bold text-[#2c221e]">{user.name}</span>
                    ? They will not be able to log into the application until unblocked.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-4">
                  <AlertDialogCancel className="rounded-xl border-[#e5d9c3] text-[#5a4836] hover:bg-[#e5d9c3]/30 cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => updateUserStatus(user._id, UserStatus.BLOCKED)}
                    className="bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-semibold cursor-pointer"
                  >
                    Yes, Block Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      )}

      {/* 2. If Blocked: Unblock & Edit Permissions */}
      {isBlocked && (
        <>
          <Button
            size="sm"
            disabled={isThisUpdating}
            onClick={() => updateUserStatus(user._id, UserStatus.APPROVED)}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl text-xs font-semibold gap-1.5 px-3.5 h-8.5 shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Unblock</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={isThisUpdating}
            onClick={() => onApproveClick(user)}
            className="border-[#174824]/30 text-[#174824] hover:bg-[#174824]/10 rounded-xl text-xs font-semibold gap-1.5 px-3 h-8.5 transition-all cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#174824]" />
            <span>Edit Permissions</span>
          </Button>
        </>
      )}

      {/* 3. If Pending: Approve button (opens drawer) & Reject button */}
      {isPending && (
        <>
          <Button
            size="sm"
            disabled={isThisUpdating}
            onClick={() => onApproveClick(user)}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl text-xs font-semibold gap-1.5 px-3.5 h-8.5 shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Approve</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={isThisUpdating}
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 rounded-xl text-xs font-semibold gap-1.5 px-3 h-8.5 transition-all cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl p-6 shadow-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-800 flex items-center gap-2 text-xl font-bold">
                  <ShieldAlert className="w-6 h-6 text-red-700" />
                  <span>Reject Registration Request?</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#5a4836] text-sm pt-2">
                  Are you sure you want to reject{" "}
                  <span className="font-bold text-[#2c221e]">{user.name}</span>
                  &apos;s registration request?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-4">
                <AlertDialogCancel className="rounded-xl border-[#e5d9c3] text-[#5a4836] hover:bg-[#e5d9c3]/30 cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateUserStatus(user._id, UserStatus.REJECTED)}
                  className="bg-red-700 hover:bg-red-800 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Yes, Reject Request
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* 4. If Rejected: Re-Approve button */}
      {isRejected && (
        <Button
          size="sm"
          disabled={isThisUpdating}
          onClick={() => onApproveClick(user)}
          className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl text-xs font-semibold gap-1.5 px-3.5 h-8.5 shadow-xs transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Re-Approve</span>
        </Button>
      )}
    </>
  );
}
