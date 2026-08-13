"use client";

import { useRef, useState, useTransition } from "react";
import { createEntry } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker, type DatePickerHandle } from "@/components/ui/date-picker";
import { formatBRL, todayISO } from "@/lib/date-helpers";

export function EntryForm({ readOnly = false }: { readOnly?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deposito, setDeposito] = useState(0);
  const [saque, setSaque] = useState(0);
  const [clienteParte, setClienteParte] = useState(0);
  const [cpa, setCpa] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<DatePickerHandle>(null);

  function handleSubmit(formData: FormData) {
    if (readOnly) return;
    startTransition(async () => {
      const result = await createEntry({ error: null }, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      formRef.current?.reset();
      dateRef.current?.reset();
      setDeposito(0);
      setSaque(0);
      setClienteParte(0);
      setCpa(0);
    });
  }

  const lucro = saque - deposito - clienteParte + cpa;

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-7">
      <div>
        <Label htmlFor="entry_date">Data</Label>
        <DatePicker
          ref={dateRef}
          id="entry_date"
          name="entry_date"
          defaultValue={todayISO()}
          disabled={readOnly}
          required
        />
      </div>
      <div>
        <Label htmlFor="casa_aposta">Casa de aposta</Label>
        <Input
          id="casa_aposta"
          name="casa_aposta"
          placeholder="Ex: Bet365"
          disabled={readOnly}
          required
        />
      </div>
      <div>
        <Label htmlFor="cliente_nome">Cliente — opcional</Label>
        <Input
          id="cliente_nome"
          name="cliente_nome"
          placeholder="Nome do cliente"
          disabled={readOnly}
        />
      </div>
      <div>
        <Label htmlFor="cliente_parte">Parte do cliente (R$)</Label>
        <Input
          id="cliente_parte"
          name="cliente_parte"
          type="number"
          step="0.01"
          defaultValue="0"
          disabled={readOnly}
          required
          onChange={(e) => setClienteParte(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="deposito">Depósito (R$)</Label>
        <Input
          id="deposito"
          name="deposito"
          type="number"
          step="0.01"
          defaultValue="0"
          disabled={readOnly}
          required
          onChange={(e) => setDeposito(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="saque">Saque (R$)</Label>
        <Input
          id="saque"
          name="saque"
          type="number"
          step="0.01"
          defaultValue="0"
          disabled={readOnly}
          required
          onChange={(e) => setSaque(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="cpa">CPA (R$) — opcional</Label>
        <Input
          id="cpa"
          name="cpa"
          type="number"
          step="0.01"
          defaultValue="0"
          disabled={readOnly}
          onChange={(e) => setCpa(Number(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-2 sm:col-span-7">
        <Label htmlFor="nota">Lembrete — opcional</Label>
        <Input
          id="nota"
          name="nota"
          placeholder="Ex: o que você fez nesse lançamento"
          disabled={readOnly}
        />
      </div>
      <div className="col-span-2 flex items-end justify-between gap-4 sm:col-span-7">
        <p className="text-sm text-neutral-400">
          Lucro calculado:{" "}
          <span className={lucro >= 0 ? "font-medium text-emerald-400" : "font-medium text-red-400"}>
            {formatBRL(lucro)}
          </span>
        </p>
      </div>
      <div className="col-span-2 sm:col-span-7">
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={readOnly || pending}>
          {readOnly ? "Assine para adicionar" : pending ? "Adicionando..." : "Adicionar lançamento"}
        </Button>
      </div>
    </form>
  );
}
