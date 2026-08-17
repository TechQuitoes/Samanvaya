"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DataManager from "@/lib/data-manager";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = DataManager.getToken();
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-[#ece6d5] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#174824] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
