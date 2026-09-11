"use client";

import { useRef, useState, useTransition } from "react";
import { createRodadaEntry } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker, type DatePickerHandle } from "@/components/ui/date-picker";
import { formatBRL, todayISO } from "@/lib/date-helpers";

/**
 * Rodadas grátis não têm odd nem aposta — o giro é promoção da casa. Por isso
 * o formulário é próprio, e não o dos mercados esportivos.
 */
export function RodadaEntryForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [valorGanho, setValorGanho] = useState(0);
  const [clienteParte, setClienteParte] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<DatePickerHandle>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createRodadaEntry({ error: null }, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      formRef.current?.reset();
      dateRef.current?.reset();
      setValorGanho(0);
      setClienteParte(0);
    });
  }

  const lucro = valorGanho - clienteParte;

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-6">
      <div>
        <Label htmlFor="rodadas_entry_date">Data</Label>
        <DatePicker
          ref={dateRef}
          id="rodadas_entry_date"
          name="entry_date"
          defaultValue={todayISO()}
          required
        />
      </div>
      <div>
        <Label htmlFor="rodadas_casa_aposta">Casa de aposta</Label>
        <Input id="rodadas_casa_aposta" name="casa_aposta" placeholder="Ex: Bet365" required />
      </div>
      <div>
        <Label htmlFor="rodadas_quantidade">Qtd. de rodadas</Label>
        <Input
          id="rodadas_quantidade"
          name="quantidade"
          type="number"
          step="1"
          min="0"
          defaultValue="0"
        />
      </div>
      <div>
        <Label htmlFor="rodadas_valor_ganho">Valor ganho (R$)</Label>
        <Input
          id="rodadas_valor_ganho"
          name="valor_ganho"
          type="number"
          step="0.01"
          defaultValue="0"
          required
          onChange={(e) => setValorGanho(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="rodadas_cliente_nome">Cliente (opcional)</Label>
        <Input id="rodadas_cliente_nome" name="cliente_nome" placeholder="Nome do cliente" />
      </div>
      <div>
        <Label htmlFor="rodadas_cliente_parte">Parte do cliente (R$)</Label>
        <Input
          id="rodadas_cliente_parte"
          name="cliente_parte"
          type="number"
          step="0.01"
          defaultValue="0"
          onChange={(e) => setClienteParte(Number(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-2 flex items-end justify-between gap-4 sm:col-span-6">
        <p className="text-sm text-neutral-400">
          Lucro calculado:{" "}
          <span className={lucro >= 0 ? "font-medium text-emerald-400" : "font-medium text-red-400"}>
            {formatBRL(lucro)}
          </span>
        </p>
      </div>
      <div className="col-span-2 sm:col-span-6">
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar lançamento"}
        </Button>
      </div>
    </form>
  );
}
