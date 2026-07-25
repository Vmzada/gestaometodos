import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-6px_rgba(16,185,129,0.6)] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_28px_-4px_rgba(16,185,129,0.75)] hover:-translate-y-0.5 disabled:from-emerald-800 disabled:to-emerald-900 disabled:translate-y-0 disabled:shadow-none",
  secondary:
    "border border-white/10 bg-neutral-800/80 text-neutral-100 hover:bg-neutral-700/80 disabled:bg-neutral-900",
  danger:
    "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_8px_20px_-6px_rgba(239,68,68,0.6)] hover:-translate-y-0.5 disabled:from-red-800 disabled:to-red-900 disabled:translate-y-0",
  ghost: "bg-transparent text-neutral-300 hover:bg-white/5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
