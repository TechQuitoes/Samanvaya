import { User, UserRole } from '@/types/auth';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const PERMISSIONS_KEY = 'permissions';

export const DataManager = {
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user?.permissions) {
        this.setPermissions(user.permissions);
      }
    }
  },

  getPermissions(): Record<string, Record<string, boolean>> | null {
    if (typeof window !== 'undefined') {
      const permStr = localStorage.getItem(PERMISSIONS_KEY);
      if (permStr) {
        try {
          return JSON.parse(permStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  setPermissions(permissions: Record<string, Record<string, boolean>>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
    }
  },

  isSuperAdmin(): boolean {
    const user = this.getUser();
    if (!user || !user.role) return false;
    const r = (user.role as string).toLowerCase().trim();
    return (
      r === 'super admin' ||
      r === 'super administrator' ||
      r === 'admin' ||
      r === 'administrator' ||
      user.role === UserRole.SUPER_ADMIN ||
      user.role === UserRole.ADMIN
    );
  },

  hasPermission(moduleId: string, action: string = 'view'): boolean {
    // 1. Super Admin & Admin have unrestricted access
    if (this.isSuperAdmin()) {
      return true;
    }

    // 2. Check granular module permissions
    const perms = this.getPermissions();
    if (perms && perms[moduleId]) {
      return !!perms[moduleId][action];
    }

    return false;
  },

  cleanAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PERMISSIONS_KEY);
    }
  },
};

export default DataManager;
