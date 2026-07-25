"use client";

import { useActionState, useState } from "react";
import { updateEntry, deleteEntry } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBRL } from "@/lib/date-helpers";
import type { Entry } from "@/lib/database.types";

export function EntriesTable({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-neutral-500">Nenhum lançamento neste período.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-neutral-400">
            <th className="py-2 pr-3 font-medium">Data</th>
            <th className="py-2 pr-3 font-medium">Casa de aposta</th>
            <th className="py-2 pr-3 font-medium">Cliente</th>
            <th className="py-2 pr-3 font-medium">Parte do cliente</th>
            <th className="py-2 pr-3 font-medium">Depósito</th>
            <th className="py-2 pr-3 font-medium">Saque</th>
            <th className="py-2 pr-3 font-medium">Lucro</th>
            <th className="py-2 pr-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EntryRow({ entry }: { entry: Entry }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deposito, setDeposito] = useState(entry.deposito);
  const [saque, setSaque] = useState(entry.saque);
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      try {
        await updateEntry(entry.id, formData);
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
      await deleteEntry(entry.id);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    const lucroPreview = saque - deposito;
    return (
      <tr className="border-b border-neutral-900">
        <td colSpan={8} className="py-3">
          <form action={formAction} className="grid grid-cols-2 gap-2 sm:grid-cols-6">
            <Input name="entry_date" type="date" defaultValue={entry.entry_date} required />
            <Input name="casa_aposta" defaultValue={entry.casa_aposta} required />
            <Input name="cliente_nome" defaultValue={entry.cliente_nome} required />
            <Input
              name="cliente_parte"
              type="number"
              step="0.01"
              defaultValue={entry.cliente_parte}
              required
            />
            <Input
              name="deposito"
              type="number"
              step="0.01"
              defaultValue={entry.deposito}
              required
              onChange={(e) => setDeposito(Number(e.target.value) || 0)}
            />
            <Input
              name="saque"
              type="number"
              step="0.01"
              defaultValue={entry.saque}
              required
              onChange={(e) => setSaque(Number(e.target.value) || 0)}
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
      <td className="py-2 pr-3">{entry.cliente_nome}</td>
      <td className="py-2 pr-3">{formatBRL(entry.cliente_parte)}</td>
      <td className="py-2 pr-3">{formatBRL(entry.deposito)}</td>
      <td className="py-2 pr-3">{formatBRL(entry.saque)}</td>
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
