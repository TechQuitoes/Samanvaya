"use client";

import React from "react";
import ECard from "@/components/ui/ECard";
import DonutChart, { DonutChartSegment } from "@/components/charts/DonutChart";

const DEFAULT_TASK_DATA: DonutChartSegment[] = [
  { name: "Overdue", value: 3, color: "#b83a24" },
  { name: "Today", value: 4, color: "#e69500" },
  { name: "Upcoming", value: 5, color: "#2d6a4f" },
];

export default function MyTasksCard({
  data = DEFAULT_TASK_DATA,
  totalPending = 12,
}: {
  data?: DonutChartSegment[];
  totalPending?: number;
}) {
  return (
    <ECard
      title="My Tasks"
      footerAction={{ label: "View All", href: "/tasks" }}
      className="h-full"
    >
      <div className="flex items-center justify-center pt-0.5">
        <DonutChart
          data={data}
          centerValue={totalPending}
          centerLabel="Pending"
          size={120}
          strokeWidth={18}
        />
      </div>
    </ECard>
  );
}
