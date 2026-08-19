"use client";

import { Contact, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";

export default function ContactsPage() {
  return (
    <SacredPortalLayout>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs">
            <Contact className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#174824]">Devotee & VIP Contacts Directory</h2>
            <p className="text-xs sm:text-sm text-[#5a4836] font-medium">
              Global directory of devotees, life patrons, and center contacts
            </p>
          </div>
        </div>
      </div>

      <LotusDivider maxWidth="full" iconSize={20} className="my-1" />

      <Card className="rounded-[24px] border-[#e5d9c3] bg-[#faf4e8] p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#174824]/10 text-[#174824] flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-[#174824]">Contacts Module</h3>
        <p className="text-xs sm:text-sm text-[#5a4836] max-w-md mx-auto">
          Manage contacts with roles, centers, tags, and communication history.
        </p>
      </Card>
    </SacredPortalLayout>
  );
}
