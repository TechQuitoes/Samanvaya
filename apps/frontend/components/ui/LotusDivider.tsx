import Image from "next/image";
import { cn } from "@/lib/utils";

interface LotusDividerProps {
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "full";
  iconSize?: number;
  text?: string;
  isDevanagari?: boolean;
}

const maxWidthMap = {
  sm: "max-w-[200px]",
  md: "max-w-[260px]",
  lg: "max-w-[320px]",
  full: "w-full",
};

export default function LotusDivider({
  className,
  maxWidth = "md",
  iconSize = 20,
  text,
  isDevanagari = false,
}: LotusDividerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 my-2 w-full",
        maxWidthMap[maxWidth],
        className
      )}
    >
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#cfa35d] to-[#cfa35d]" />
      
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
            src="/assests/flower-icon.png"
            alt="Lotus Accent"
            width={iconSize}
            height={iconSize}
            className="object-contain"
          />
        </div>
      )}

      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#cfa35d] to-[#cfa35d]" />
    </div>
  );
}
