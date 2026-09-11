"use client";

import { useActionState, useMemo, useState } from "react";
import { updateRodadaEntry, deleteRodadaEntry } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination, PAGE_SIZE } from "@/components/ui/pagination";
import { formatBRL } from "@/lib/date-helpers";
import type { RodadaEntry } from "@/lib/database.types";

export function RodadasEntriesTable({ entries }: { entries: RodadaEntry[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEntries = useMemo(
    () => entries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [entries, currentPage],
  );

  if (entries.length === 0) {
    return <p className="text-sm text-neutral-500">Nenhum lançamento neste período.</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-neutral-400">
              <th className="py-2 pr-3 font-medium">Data</th>
              <th className="py-2 pr-3 font-medium">Casa de aposta</th>
              <th className="py-2 pr-3 font-medium">Rodadas</th>
              <th className="py-2 pr-3 font-medium">Valor ganho</th>
              <th className="py-2 pr-3 font-medium">Cliente</th>
              <th className="py-2 pr-3 font-medium">Parte do cliente</th>
              <th className="py-2 pr-3 font-medium">Lucro</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry) => (
              <RodadaEntryRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function RodadaEntryRow({ entry }: { entry: RodadaEntry }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [valorGanho, setValorGanho] = useState(entry.valor_ganho);
  const [clienteParte, setClienteParte] = useState(entry.cliente_parte);
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      try {
        await updateRodadaEntry(entry.id, formData);
        setEditing(false);
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Erro ao salvar." };
      }
    },
    { error: null },
  );

  async function handleDelete() {
    if (!confirm("Excluir este lançamento?")) return;
    setDeleting(true);
    try {
      await deleteRodadaEntry(entry.id);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    const lucroPreview = valorGanho - clienteParte;
    return (
      <tr className="border-b border-neutral-900">
        <td colSpan={8} className="py-3">
          <form action={formAction} className="grid grid-cols-2 gap-2 sm:grid-cols-6">
            <DatePicker name="entry_date" defaultValue={entry.entry_date} required />
            <Input name="casa_aposta" defaultValue={entry.casa_aposta} required />
            <Input name="quantidade" type="number" step="1" min="0" defaultValue={entry.quantidade} />
            <Input
              name="valor_ganho"
              type="number"
              step="0.01"
              defaultValue={entry.valor_ganho}
              required
              onChange={(e) => setValorGanho(Number(e.target.value) || 0)}
            />
            <Input
              name="cliente_nome"
              placeholder="Cliente (opcional)"
              defaultValue={entry.cliente_nome ?? ""}
            />
            <Input
              name="cliente_parte"
              type="number"
              step="0.01"
              defaultValue={entry.cliente_parte}
              onChange={(e) => setClienteParte(Number(e.target.value) || 0)}
            />
            <div className="col-span-2 flex items-center gap-4 sm:col-span-6">
              <p className="text-sm text-neutral-400">
                Lucro calculado:{" "}
                <span
                  className={
                    lucroPreview >= 0 ? "font-medium text-emerald-400" : "font-medium text-red-400"
                  }
                >
                  {formatBRL(lucroPreview)}
                </span>
              </p>
            </div>
            <div className="col-span-2 flex gap-2 sm:col-span-6">
              <Button type="submit" disabled={pending}>
                {pending ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
            {state.error && (
              <p className="col-span-2 text-sm text-red-400 sm:col-span-6">{state.error}</p>
            )}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-neutral-900 text-neutral-200 transition-colors hover:bg-white/[0.03]">
      <td className="py-2 pr-3">{formatDate(entry.entry_date)}</td>
      <td className="py-2 pr-3">{entry.casa_aposta}</td>
      <td className="py-2 pr-3 text-neutral-400">{entry.quantidade || "—"}</td>
      <td className="py-2 pr-3">{formatBRL(entry.valor_ganho)}</td>
      <td className="py-2 pr-3 text-neutral-400">{entry.cliente_nome || "—"}</td>
      <td className="py-2 pr-3">{formatBRL(entry.cliente_parte)}</td>
      <td
        className={`py-2 pr-3 font-medium ${entry.lucro >= 0 ? "text-emerald-400" : "text-red-400"}`}
      >
        {formatBRL(entry.lucro)}
      </td>
      <td className="py-2 pr-3">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setEditing(true)}>
            Editar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </td>
    </tr>
  );
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
