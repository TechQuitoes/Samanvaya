import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all select-none cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174824]",
  {
    variants: {
      variant: {
        default:
          "bg-[#174824] hover:bg-[#12391c] text-white shadow-md shadow-emerald-950/10",
        "sacred-primary":
          "bg-[#174824] hover:bg-[#12391c] text-white shadow-md shadow-emerald-950/10",
        "sacred-outline":
          "bg-[#fefdfa] border border-[#cfa35d] hover:bg-[#fff9ef] text-[#b88636]",
        ghost: "hover:bg-amber-900/5 text-[#2c221e]",
        icon: "rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-amber-900/10 text-[#2c221e] hover:bg-white",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[#cfa35d] bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-5 text-base",
        sm: "h-9 px-3 text-xs",
        md: "h-12 px-5 text-base",
        lg: "h-14 px-6 text-lg",
        icon: "w-10 h-10 p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "sacred-primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
