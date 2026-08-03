export function GreenRedToggle({
  value,
  onChange,
  name = "resultado",
}: {
  value: "green" | "red";
  onChange: (value: "green" | "red") => void;
  name?: string;
}) {
  return (
    <div className="flex gap-1.5">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => onChange("green")}
        className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
          value === "green"
            ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
            : "border-white/10 bg-neutral-900/80 text-neutral-500 hover:border-emerald-500/30 hover:text-neutral-300"
        }`}
      >
        Green
      </button>
      <button
        type="button"
        onClick={() => onChange("red")}
        className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
          value === "red"
            ? "border-red-500/60 bg-red-500/20 text-red-300"
            : "border-white/10 bg-neutral-900/80 text-neutral-500 hover:border-red-500/30 hover:text-neutral-300"
        }`}
      >
        Red
      </button>
    </div>
  );
}
