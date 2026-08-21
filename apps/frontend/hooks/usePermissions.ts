"use client";

import { useState, useEffect, useCallback } from "react";
import DataManager from "@/lib/data-manager";
import { User, UserRole } from "@/types/auth";

export function usePermissions() {
  const [user, setUser] = useState<User | null>(() => DataManager.getUser());
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>> | null>(
    () => DataManager.getPermissions()
  );

  useEffect(() => {
    const localUser = DataManager.getUser();
    const localPerms = DataManager.getPermissions();
    if (localUser) setUser(localUser);
    if (localPerms) setPermissions(localPerms);
  }, []);

  const isSuperAdmin = useCallback(() => {
    if (!user || !user.role) return false;
    const r = (user.role as string).toLowerCase().trim();
    return (
      r === "super admin" ||
      r === "super administrator" ||
      r === "admin" ||
      r === "administrator" ||
      user.role === UserRole.SUPER_ADMIN ||
      user.role === UserRole.ADMIN
    );
  }, [user]);

  const can = useCallback(
    (moduleId: string, action: string = "view"): boolean => {
      // 1. Super Admin and Admin have complete unrestricted access
      if (isSuperAdmin()) {
        return true;
      }

      // 2. Check granular module permission map from login data
      if (permissions && permissions[moduleId]) {
        return !!permissions[moduleId][action];
      }

      return false;
    },
    [isSuperAdmin, permissions]
  );

  const hasModuleAccess = useCallback(
    (moduleId: string): boolean => {
      return can(moduleId, "view");
    },
    [can]
  );

  return {
    user,
    permissions,
    isSuperAdmin: isSuperAdmin(),
    can,
    hasModuleAccess,
  };
}

export default usePermissions;
