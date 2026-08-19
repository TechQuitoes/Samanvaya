"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataManager from "@/lib/data-manager";
import { UserRole } from "@/types/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = DataManager.getUser();
    const token = DataManager.getToken();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    const allowedRoles = [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      "Super Administrator",
      "Administrator",
      "Admin",
      "Super Admin",
    ];
    if (!allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3e9]">
        <div className="animate-pulse text-[#174824] text-lg font-semibold">
          Verifying access...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
