"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Mail,
  Phone,
  RotateCcw,
  LayoutDashboard,
  Plane,
  Calendar,
  FileText,
  BookOpen,
  CheckSquare,
  Heart,
  Users,
  Contact,
  Archive,
  BarChart3,
  UsersRound,
  Settings,
  LucideIcon,
  Check,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, UserRole } from "@/types/auth";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export";

export interface SidebarModuleItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
}

/** Exact 13 modules matching the Samanvaya Admin Sidebar */
export const SIDEBAR_MODULES: SidebarModuleItem[] = [
  { id: "dashboard", title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "travel", title: "Travel", href: "/travel", icon: Plane },
  { id: "calendar", title: "Calendar", href: "/calendar", icon: Calendar },
  { id: "documentation", title: "Documentation", href: "/documentation", icon: FileText },
  { id: "journal", title: "Journal", href: "/journal", icon: BookOpen },
  { id: "tasks", title: "Tasks", href: "/tasks", icon: CheckSquare },
  { id: "health", title: "Health", href: "/health", icon: Heart },
  { id: "meetings", title: "Meetings", href: "/meetings", icon: Users },
  { id: "contacts", title: "Contacts", href: "/contacts", icon: Contact },
  { id: "archival", title: "Archival", href: "/archival", icon: Archive },
  { id: "reports", title: "Reports", href: "/reports", icon: BarChart3 },
  { id: "users", title: "Users", href: "/admin/approvals", icon: UsersRound },
  { id: "settings", title: "Settings", href: "/settings", icon: Settings },
];

export const PERMISSION_ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
  { key: "export", label: "Export" },
];

function getDefaultPermissions(role: string): Record<string, Record<PermissionAction, boolean>> {
  const perms: Record<string, Record<PermissionAction, boolean>> = {};

  SIDEBAR_MODULES.forEach((mod) => {
    if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
      perms[mod.id] = { view: true, create: true, edit: true, delete: true, approve: true, export: true };
    } else {
      // Default: View enabled for all modules
      perms[mod.id] = { view: true, create: false, edit: false, delete: false, approve: false, export: false };
    }
  });

  return perms;
}

interface ApproveUserDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  isUpdating: boolean;
  onConfirmApproval: (userId: string, selectedRole: string, permissions: any) => Promise<void>;
}

export default function ApproveUserDrawer({
  user,
  isOpen,
  onClose,
  isUpdating,
  onConfirmApproval,
}: ApproveUserDrawerProps) {
  const [permissions, setPermissions] = useState<Record<string, Record<PermissionAction, boolean>>>({});

  useEffect(() => {
    if (user) {
      if (user.permissions && Object.keys(user.permissions).length > 0) {
        // Hydrate from existing saved user permissions
        const existing: Record<string, Record<PermissionAction, boolean>> = {};
        SIDEBAR_MODULES.forEach((mod) => {
          existing[mod.id] = {
            view: !!user.permissions?.[mod.id]?.view,
            create: !!user.permissions?.[mod.id]?.create,
            edit: !!user.permissions?.[mod.id]?.edit,
            delete: !!user.permissions?.[mod.id]?.delete,
            approve: !!user.permissions?.[mod.id]?.approve,
            export: !!user.permissions?.[mod.id]?.export,
          };
        });
        setPermissions(existing);
      } else {
        const role = (user.role as string) || UserRole.VIEWER;
        setPermissions(getDefaultPermissions(role));
      }
    }
  }, [user]);

  if (!user) return null;

  const togglePermission = (moduleId: string, action: PermissionAction) => {
    setPermissions((prev) => {
      const currentMod = prev[moduleId] || {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        export: false,
      };

      const willBeActive = !currentMod[action];

      // 1. If turning OFF View -> Automatically turn OFF all permissions for this module
      if (action === "view" && !willBeActive) {
        return {
          ...prev,
          [moduleId]: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            approve: false,
            export: false,
          },
        };
      }

      // 2. If turning ON Create, Edit, Delete, Approve, Export -> Automatically turn ON View
      return {
        ...prev,
        [moduleId]: {
          ...currentMod,
          [action]: willBeActive,
          view: action !== "view" && willBeActive ? true : action === "view" ? willBeActive : currentMod.view,
        },
      };
    });
  };

  // Toggle entire row for a single module
  const toggleRow = (moduleId: string) => {
    setPermissions((prev) => {
      const currentMod = prev[moduleId] || {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        export: false,
      };
      const allActive = PERMISSION_ACTIONS.every((a) => currentMod[a.key]);
      const newState = !allActive;

      return {
        ...prev,
        [moduleId]: {
          view: newState,
          create: newState,
          edit: newState,
          delete: newState,
          approve: newState,
          export: newState,
        },
      };
    });
  };

  // Toggle entire column
  const toggleColumn = (action: PermissionAction) => {
    setPermissions((prev) => {
      const allActive = SIDEBAR_MODULES.every((mod) => prev[mod.id]?.[action]);
      const newState = !allActive;

      const updated = { ...prev };
      SIDEBAR_MODULES.forEach((mod) => {
        const currentMod = updated[mod.id] || {
          view: false,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: false,
        };

        if (action === "view" && !newState) {
          // Turning off View column -> clear all permissions
          updated[mod.id] = {
            view: false,
            create: false,
            edit: false,
            delete: false,
            approve: false,
            export: false,
          };
        } else {
          updated[mod.id] = {
            ...currentMod,
            [action]: newState,
            view: action !== "view" && newState ? true : action === "view" ? newState : currentMod.view,
          };
        }
      });
      return updated;
    });
  };

  const handleSetAll = (state: boolean) => {
    setPermissions(() => {
      const updated: Record<string, Record<PermissionAction, boolean>> = {};
      SIDEBAR_MODULES.forEach((mod) => {
        updated[mod.id] = {
          view: state,
          create: state,
          edit: state,
          delete: state,
          approve: state,
          export: state,
        };
      });
      return updated;
    });
  };

  const handleReset = () => {
    const role = (user.role as string) || UserRole.VIEWER;
    setPermissions(getDefaultPermissions(role));
  };

  const handleSubmit = async () => {
    const role = (user.role as string) || UserRole.VIEWER;
    await onConfirmApproval(user._id, role, permissions);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 bg-[#faf5ec] border-l border-[#e5d9c3] flex flex-col h-full shadow-2xl z-50 overflow-hidden"
      >
        {/* Responsive Header */}
        <div className="bg-[#fffdfa] border-b border-[#e5d9c3] px-4 sm:px-6 py-3.5 sm:py-4 space-y-2.5">
          <div className="flex items-start sm:items-center justify-between gap-3">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-2xs">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "Avatar"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm sm:text-base font-bold text-[#174824]">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-[#174824] truncate">
                    {user.name}
                  </h3>
                  {user.authProvider === "GOOGLE" || user.googleId ? (
                    <Badge
                      variant="outline"
                      className="text-[9px] sm:text-[10px] px-1.5 py-0 border-blue-200 text-blue-800 bg-blue-50/90 font-semibold flex items-center gap-1"
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
                      className="text-[9px] sm:text-[10px] px-1.5 py-0 border-[#e5d9c3] text-[#5a4836] bg-[#fbf8f0] font-semibold"
                    >
                      Direct Form
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5a4836] font-medium mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
                    <Mail className="w-3 h-3 text-[#5a4836]/60 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </span>
                  {user.mobile && (
                    <span className="hidden sm:flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#5a4836]/60" />
                      {user.mobile}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions (Desktop & Mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSetAll(true)}
                className="text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 text-[#174824] hover:underline cursor-pointer"
              >
                Select All
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => handleSetAll(false)}
                className="text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 text-red-700 hover:underline cursor-pointer"
              >
                Clear All
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 text-[#5a4836] hover:underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Content Area: Responsive (Desktop Matrix Table vs Mobile Card List) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {/* ══════════════════════════════════════════════════════════
              1. DESKTOP VIEW (sm and above): Clean Matrix Table
             ══════════════════════════════════════════════════════════ */}
          <div className="hidden sm:block bg-[#fffdfa] border border-[#e5d9c3] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f0e1] border-b border-[#e5d9c3] text-[11px] font-bold text-[#5a4836] uppercase tracking-wider select-none">
                    <th className="py-3.5 px-4 min-w-[170px]">
                      Modules (13)
                    </th>
                    {PERMISSION_ACTIONS.map((action) => (
                      <th
                        key={action.key}
                        onClick={() => toggleColumn(action.key)}
                        title={`Click to toggle all ${action.label} permissions`}
                        className="py-3.5 px-2 text-center min-w-[65px] hover:text-[#174824] hover:bg-[#eae0cd]/60 cursor-pointer transition-colors"
                      >
                        <span className="inline-flex items-center gap-1">
                          {action.label}
                        </span>
                      </th>
                    ))}
                    <th className="py-3.5 px-3 text-center min-w-[55px]">
                      All
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5d9c3]/50 text-xs">
                  {SIDEBAR_MODULES.map((mod) => {
                    const IconComp = mod.icon;
                    const modPerms = permissions[mod.id] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      approve: false,
                      export: false,
                    };
                    const isAllRowActive = PERMISSION_ACTIONS.every((a) => modPerms[a.key]);

                    return (
                      <tr
                        key={mod.id}
                        className="hover:bg-[#fcfaf5] transition-colors group"
                      >
                        {/* Module Name with Official Sidebar Icon */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#174824]/10 text-[#174824] flex items-center justify-center flex-shrink-0 group-hover:bg-[#174824] group-hover:text-white transition-colors">
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-[#2c221e] text-xs">
                              {mod.title}
                            </span>
                          </div>
                        </td>

                        {/* 6 Clean Checkboxes (Desktop) */}
                        {PERMISSION_ACTIONS.map((action) => {
                          const isChecked = !!modPerms[action.key];

                          return (
                            <td
                              key={action.key}
                              className="py-3 px-2 text-center"
                            >
                              <button
                                type="button"
                                onClick={() => togglePermission(mod.id, action.key)}
                                className={`w-5 h-5 mx-auto rounded-md border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                                  isChecked
                                    ? "bg-[#174824] text-white border-[#174824]"
                                    : "bg-white border-[#cbb698] hover:border-[#174824] hover:bg-[#faf4e8]"
                                }`}
                                title={`Toggle ${action.label} for ${mod.title}`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                              </button>
                            </td>
                          );
                        })}

                        {/* Row Quick Toggle Button */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleRow(mod.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              isAllRowActive
                                ? "bg-[#174824] text-white border-[#174824]"
                                : "bg-white text-[#5a4836] border-[#e5d9c3] hover:bg-[#faf4e8]"
                            }`}
                          >
                            {isAllRowActive ? "All" : "Toggle"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              2. MOBILE VIEW (< sm): Clean Finger-Friendly Card List
             ══════════════════════════════════════════════════════════ */}
          <div className="sm:hidden space-y-2.5">
            {SIDEBAR_MODULES.map((mod) => {
              const IconComp = mod.icon;
              const modPerms = permissions[mod.id] || {
                view: false,
                create: false,
                edit: false,
                delete: false,
                approve: false,
                export: false,
              };
              const activeCount = PERMISSION_ACTIONS.filter((a) => modPerms[a.key]).length;
              const isAllRowActive = activeCount === PERMISSION_ACTIONS.length;

              return (
                <div
                  key={mod.id}
                  className="bg-[#fffdfa] border border-[#e5d9c3] rounded-xl p-3 space-y-2.5 shadow-2xs"
                >
                  {/* Module Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#174824]/10 text-[#174824] flex items-center justify-center flex-shrink-0">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-[#2c221e] text-xs">
                        {mod.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#faf5ec] border border-[#e5d9c3] text-[#5a4836]">
                        {activeCount} / 6
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRow(mod.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          isAllRowActive
                            ? "bg-[#174824] text-white border-[#174824]"
                            : "bg-white text-[#5a4836] border-[#e5d9c3]"
                        }`}
                      >
                        {isAllRowActive ? "All" : "Toggle"}
                      </button>
                    </div>
                  </div>

                  {/* 6 Mobile Checkbox Pills (3 columns x 2 rows) */}
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    {PERMISSION_ACTIONS.map((action) => {
                      const isChecked = !!modPerms[action.key];

                      return (
                        <button
                          key={action.key}
                          type="button"
                          onClick={() => togglePermission(mod.id, action.key)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer select-none ${
                            isChecked
                              ? "bg-[#174824] text-white border-[#174824] shadow-2xs"
                              : "bg-[#faf5ec]/80 text-[#5a4836] border-[#e5d9c3] hover:bg-[#174824]/5"
                          }`}
                        >
                          {isChecked ? (
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-xs border border-[#cbb698] bg-white inline-block flex-shrink-0" />
                          )}
                          <span className="text-[11px]">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="bg-[#fffdfa] border-t border-[#e5d9c3] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <p className="text-xs text-[#8c7865] hidden sm:block">
            Permissions will take effect upon user sign-in.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 sm:flex-initial border-[#e5d9c3] text-[#5a4836] hover:bg-[#faf4e8] rounded-xl text-xs font-semibold px-4 h-9 sm:h-9.5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="flex-1 sm:flex-initial bg-[#174824] hover:bg-[#12391c] text-white rounded-xl text-xs font-semibold px-5 h-9 sm:h-9.5 gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUpdating ? "Approving..." : "Confirm & Approve"}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
