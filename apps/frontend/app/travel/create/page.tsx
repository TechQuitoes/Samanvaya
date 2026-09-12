"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import TravelWizardForm from "@/components/travel/TravelWizardForm";

function CreateTravelPageContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf5eb] flex flex-col justify-between">
      {/* ─── TOP NAV BAR ─── */}
      <header className="sticky top-0 z-30 bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#e5d9c3] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => router.push("/travel")}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#174824] hover:text-[#174824]/80 transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Travel Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <h1 className="font-serif-display text-lg sm:text-xl font-bold text-[#174824]">
            Create Travel
          </h1>
        </div>

        <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
          <Image
            src="/image-assets/04_lotus_icon_gold.png"
            alt="Lotus Emblem"
            fill
            className="object-contain"
          />
        </div>
      </header>

      {/* ─── MAIN FORM CONTAINER ─── */}
      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        <TravelWizardForm
          onSuccess={() => router.push("/travel")}
          onCancel={() => router.push("/travel")}
        />
      </main>

      {/* ─── SACRED FOOTER ARTWORK & QUOTE ─── */}
      <footer className="mt-8 pt-8 pb-6 text-center space-y-2 border-t border-[#e5d9c3]/40 bg-gradient-to-t from-[#f5ede0] to-transparent">
        <div className="relative w-8 h-8 mx-auto opacity-80">
          <Image
            src="/image-assets/04_lotus_icon_gold.png"
            alt="Lotus Flower"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-xs sm:text-sm font-serif-display italic text-[#174824] max-w-md mx-auto px-4 font-semibold">
          &ldquo;Every journey is an opportunity to serve and spread Krishna Consciousness.&rdquo;
        </p>
        <p className="text-[10px] text-[#8c7865] font-bold uppercase tracking-widest">
          Samanvaya &bull; Organise &bull; Coordinate &bull; Serve
        </p>
      </footer>
    </div>
  );
}

export default function CreateTravelWizardPage() {
  return (
    <SacredPortalLayout showGreeting={false}>
      <Suspense fallback={<div className="p-8 text-center text-[#174824] font-bold">Loading travel wizard...</div>}>
        <CreateTravelPageContent />
      </Suspense>
    </SacredPortalLayout>
  );
}
