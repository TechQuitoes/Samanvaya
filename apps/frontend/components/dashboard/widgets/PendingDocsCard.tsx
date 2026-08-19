"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import ECard from "@/components/ui/ECard";

export interface PendingDocItem {
  name: string;
  count: number;
}

const DEFAULT_PENDING_DOCS: PendingDocItem[] = [
  { name: "Today's Journal", count: 1 },
  { name: "Travel Photos", count: 2 },
  { name: "Meeting Notes", count: 1 },
  { name: "Medical Record", count: 1 },
];

export default function PendingDocsCard({
  items = DEFAULT_PENDING_DOCS,
}: {
  items?: PendingDocItem[];
}) {
  return (
    <ECard
      title="Pending Documentation"
      icon={BookOpen}
      footerAction={{ label: "View All", href: "/documentation" }}
      className="h-full"
    >
      <div className="space-y-2.5 pt-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 text-xs sm:text-[13px]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#174824] flex-shrink-0" />
              <span className="font-semibold text-[#2c221e] truncate">
                {item.name}
              </span>
            </div>
            <span className="font-bold text-[#2c221e] flex-shrink-0">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </ECard>
  );
}
