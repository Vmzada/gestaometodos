import { cn } from "@/lib/utils";

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6 shrink-0 text-emerald-400"
        aria-hidden="true"
      >
        <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2 10.5h20" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="14.5" r="1.4" fill="currentColor" />
      </svg>
      <span
        className={cn(
          "bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-lg font-bold tracking-tight text-transparent",
          textClassName,
        )}
      >
        Gestão dos Métodos
      </span>
    </span>
  );
}
