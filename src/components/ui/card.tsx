import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-neutral-900/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.35)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
