import Image from "next/image";
import { cn } from "@/lib/utils";

interface LotusDividerProps {
  className?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "full";
  iconSize?: number;
  text?: string;
  isDevanagari?: boolean;
}

const maxWidthMap = {
  xs: "max-w-[200px]",
  sm: "max-w-[250px]",
  md: "max-w-[300px]",
  lg: "max-w-[340px]",
  full: "w-full",
};

export default function LotusDivider({
  className,
  maxWidth = "xs",
  iconSize = 16,
  text,
  isDevanagari = false,
}: LotusDividerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 my-2 w-full mx-auto",
        maxWidthMap[maxWidth],
        className
      )}
    >
      {/* Left End Dot */}
      <div className="w-1 h-1 rounded-full bg-[#cfa35d] shrink-0" />

      {/* Left Line */}
      <div className="h-[1px] flex-1 bg-[#cfa35d]" />

      {text ? (
        <span
          className={cn(
            "text-[#174824] font-bold tracking-wider px-1",
            isDevanagari ? "font-devanagari text-2xl" : "text-sm"
          )}
        >
          {text}
        </span>
      ) : (
        <div className="relative flex-shrink-0" style={{ width: iconSize, height: iconSize }}>
          <Image
            src="/assests/04_lotus_icon_gold.svg"
            alt="Lotus Accent"
            width={iconSize}
            height={iconSize}
            className="object-contain"
          />
        </div>
      )}

      {/* Right Line */}
      <div className="h-[1px] flex-1 bg-[#cfa35d]" />

      {/* Right End Dot */}
      <div className="w-1 h-1 rounded-full bg-[#cfa35d] shrink-0" />
    </div>
  );
}
