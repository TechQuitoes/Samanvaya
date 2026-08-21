import { Suspense } from "react";
import ApprovalsDashboard from "@/app/(admin)/components/ApprovalsDashboard";

export default function AdminApprovalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#174824] font-semibold">Loading Approvals...</div>}>
      <ApprovalsDashboard />
    </Suspense>
  );
}
