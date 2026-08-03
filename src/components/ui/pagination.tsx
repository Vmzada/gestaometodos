"use client";

export const PAGE_SIZE = 20;

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-4 flex items-center justify-between gap-2">
      <p className="text-xs text-neutral-500">
        Página {page} de {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded-md border border-white/10 bg-neutral-800/80 px-2 py-1 text-xs text-neutral-200 transition-colors hover:bg-neutral-700/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-xs text-neutral-500">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[2rem] rounded-md border px-2 py-1 text-xs transition-colors ${
                p === page
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                  : "border-white/10 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md border border-white/10 bg-neutral-800/80 px-2 py-1 text-xs text-neutral-200 transition-colors hover:bg-neutral-700/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

function getPageNumbers(page: number, totalPages: number): (number | "…")[] {
  const delta = 1;
  const range: (number | "…")[] = [];
  const rangeStart = Math.max(2, page - delta);
  const rangeEnd = Math.min(totalPages - 1, page + delta);

  range.push(1);
  if (rangeStart > 2) range.push("…");
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);
  if (rangeEnd < totalPages - 1) range.push("…");
  if (totalPages > 1) range.push(totalPages);

  return range;
}
