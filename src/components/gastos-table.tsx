"use client";

import { useActionState, useMemo, useState } from "react";
import { updateGasto, deleteGasto } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination, PAGE_SIZE } from "@/components/ui/pagination";
import { formatBRL } from "@/lib/date-helpers";
import type { Gasto } from "@/lib/database.types";

export function GastosTable({ gastos }: { gastos: Gasto[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(gastos.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedGastos = useMemo(
    () => gastos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [gastos, currentPage],
  );

  if (gastos.length === 0) {
    return <p className="text-sm text-neutral-500">Nenhum gasto neste período.</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-neutral-400">
              <th className="py-2 pr-3 font-medium">Data</th>
              <th className="py-2 pr-3 font-medium">Categoria</th>
              <th className="py-2 pr-3 font-medium">Descrição</th>
              <th className="py-2 pr-3 font-medium">Valor</th>
              <th className="py-2 pr-3 font-medium">Pix</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedGastos.map((gasto) => (
              <GastoRow key={gasto.id} gasto={gasto} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function GastoRow({ gasto }: { gasto: Gasto }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viaPix, setViaPix] = useState(gasto.via_pix);
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      try {
        await updateGasto(gasto.id, formData);
        setEditing(false);
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Erro ao salvar." };
      }
    },
    { error: null },
  );

  async function handleDelete() {
    if (!confirm("Excluir este gasto?")) return;
    setDeleting(true);
    try {
      await deleteGasto(gasto.id);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <tr className="border-b border-neutral-900">
        <td colSpan={6} className="py-3">
          <form action={formAction} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <DatePicker name="gasto_date" defaultValue={gasto.gasto_date} required />
            <Input name="categoria" defaultValue={gasto.categoria} required />
            <Input
              name="valor"
              type="number"
              step="0.01"
              defaultValue={gasto.valor}
              required
            />
            <Input
              name="descricao"
              defaultValue={gasto.descricao ?? ""}
              placeholder="Descrição — opcional"
              className="col-span-2 sm:col-span-2"
            />
            <div className="col-span-2 flex items-center gap-2 sm:col-span-5">
              <input
                id={`via_pix_${gasto.id}`}
                name="via_pix"
                type="checkbox"
                checked={viaPix}
                onChange={(e) => setViaPix(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-neutral-900 accent-emerald-500"
              />
              <label htmlFor={`via_pix_${gasto.id}`} className="text-sm text-neutral-300">
                Pago via Pix
              </label>
            </div>
            {viaPix && (
              <Input
                name="pix_nome"
                defaultValue={gasto.pix_nome ?? ""}
                placeholder="Nome da pessoa — opcional"
                className="col-span-2 sm:col-span-3"
              />
            )}
            <div className="col-span-2 flex gap-2 sm:col-span-5">
              <Button type="submit" disabled={pending}>
                {pending ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
            {state.error && (
              <p className="col-span-2 text-sm text-red-400 sm:col-span-5">{state.error}</p>
            )}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-neutral-900 text-neutral-200 transition-colors hover:bg-white/[0.03]">
      <td className="py-2 pr-3">{formatDate(gasto.gasto_date)}</td>
      <td className="py-2 pr-3">{gasto.categoria}</td>
      <td className="py-2 pr-3 text-neutral-400">{gasto.descricao || "—"}</td>
      <td className="py-2 pr-3 font-medium text-red-400">{formatBRL(gasto.valor)}</td>
      <td className="py-2 pr-3 text-neutral-400">
        {gasto.via_pix ? gasto.pix_nome || "Sim" : "—"}
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
