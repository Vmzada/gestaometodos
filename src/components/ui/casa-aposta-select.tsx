"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CASAS_DE_APOSTA, normalizarCasa, type CasaDeAposta } from "@/lib/casas-de-aposta";

export interface CasaApostaSelectHandle {
  reset: () => void;
}

interface CasaApostaSelectProps {
  id?: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const FAVORITAS_KEY = "gestaodosmetodos:casas-favoritas";

function lerFavoritas(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITAS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function salvarFavoritas(lista: string[]) {
  try {
    localStorage.setItem(FAVORITAS_KEY, JSON.stringify(lista));
  } catch {
    // Sem storage: as favoritas valem só até recarregar a página.
  }
}

/** Logo da casa, ou as iniciais num círculo quando ela não tem ícone. */
function CasaIcone({ casa, size = 20 }: { casa: CasaDeAposta; size?: number }) {
  if (casa.icone) {
    return (
      <Image
        src={casa.icone}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="shrink-0 rounded-full bg-neutral-800 object-contain"
      />
    );
  }
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-neutral-700 text-[9px] font-bold text-neutral-200"
    >
      {casa.nome.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
    </span>
  );
}

/**
 * Campo de casa de aposta com a lista oficial das bets autorizadas pela SPA/MF,
 * com logo e busca. Continua aceitando texto livre: quem aposta numa casa fora
 * da lista (ou tem lançamentos antigos com outro nome) não fica travado.
 *
 * Segue o mesmo desenho do DatePicker: o valor vai num input com `name`, o
 * `.reset()` sai pela ref para os formulários limparem depois de salvar, e a
 * lista abre num portal — dentro das tabelas com rolagem horizontal, uma lista
 * comum seria cortada.
 */
export const CasaApostaSelect = forwardRef<CasaApostaSelectHandle, CasaApostaSelectProps>(
  function CasaApostaSelect(
    { id, name, defaultValue = "", required, disabled, placeholder = "Casa de aposta", className },
    ref,
  ) {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(
      null,
    );
    // Favoritas só são lidas quando a lista abre (evento do usuário): no primeiro
    // render servidor e cliente ficam iguais e a hidratação não quebra.
    const [favoritas, setFavoritas] = useState<string[] | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listId = useId();

    useImperativeHandle(ref, () => ({
      reset: () => {
        setValue(defaultValue);
        setOpen(false);
      },
    }));

    const selecionada = useMemo(() => {
      const alvo = normalizarCasa(value);
      return alvo ? CASAS_DE_APOSTA.find((c) => normalizarCasa(c.nome) === alvo) ?? null : null;
    }, [value]);

    const opcoes = useMemo(() => {
      const busca = normalizarCasa(value);
      // Com uma casa já escolhida, reabrir mostra a lista toda em vez de só ela.
      const filtrar = busca && !selecionada;
      const lista = filtrar
        ? CASAS_DE_APOSTA.filter((c) => normalizarCasa(c.nome).includes(busca))
        : CASAS_DE_APOSTA;
      const fav = new Set(favoritas ?? []);
      return [...lista.filter((c) => fav.has(c.nome)), ...lista.filter((c) => !fav.has(c.nome))];
    }, [value, selecionada, favoritas]);

    function posicionar() {
      const rect = inputRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 224) });
    }

    function abrir() {
      if (disabled) return;
      if (favoritas === null) setFavoritas(lerFavoritas());
      posicionar();
      setOpen(true);
    }

    function escolher(casa: CasaDeAposta) {
      setValue(casa.nome);
      setOpen(false);
    }

    function alternarFavorita(casa: CasaDeAposta) {
      const atual = favoritas ?? lerFavoritas();
      const proxima = atual.includes(casa.nome)
        ? atual.filter((n) => n !== casa.nome)
        : [...atual, casa.nome];
      setFavoritas(proxima);
      salvarFavoritas(proxima);
    }

    // Acompanha rolagem/redimensionamento e fecha ao clicar fora.
    useEffect(() => {
      if (!open) return;
      function onPointerDown(event: MouseEvent) {
        const target = event.target as Node;
        if (!inputRef.current?.contains(target) && !listRef.current?.contains(target)) {
          setOpen(false);
        }
      }
      window.addEventListener("resize", posicionar);
      window.addEventListener("scroll", posicionar, true);
      document.addEventListener("mousedown", onPointerDown);
      return () => {
        window.removeEventListener("resize", posicionar);
        window.removeEventListener("scroll", posicionar, true);
        document.removeEventListener("mousedown", onPointerDown);
      };
    }, [open]);

    // Mantém a opção destacada visível ao navegar pelo teclado.
    useEffect(() => {
      if (!open) return;
      listRef.current
        ?.querySelector<HTMLElement>(`[data-index="${highlight}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [highlight, open]);

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) abrir();
        setHighlight((h) => Math.min(h + 1, Math.max(opcoes.length - 1, 0)));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (event.key === "Enter") {
        // Com a lista aberta, Enter escolhe a casa em vez de enviar o formulário.
        if (open && opcoes[highlight]) {
          event.preventDefault();
          escolher(opcoes[highlight]);
        }
      } else if (event.key === "Escape" || event.key === "Tab") {
        setOpen(false);
      }
    }

    return (
      <div className="relative">
        {selecionada && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
            <CasaIcone casa={selecionada} size={18} />
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(e) => {
            setValue(e.target.value);
            setHighlight(0);
            abrir();
          }}
          onFocus={abrir}
          onClick={abrir}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full rounded-md border border-white/10 bg-neutral-900/80 py-2 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 transition-shadow focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60",
            selecionada ? "pl-9" : "pl-3",
            className,
          )}
        />

        {open &&
          coords &&
          createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              style={{ top: coords.top, left: coords.left, width: coords.width }}
              className="fixed z-50 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 p-1 shadow-2xl shadow-black/60"
            >
              {opcoes.length === 0 ? (
                <li className="px-3 py-2 text-xs text-neutral-500">
                  Nenhuma casa da lista oficial — o nome digitado será usado.
                </li>
              ) : (
                opcoes.map((casa, i) => {
                  const favorita = favoritas?.includes(casa.nome) ?? false;
                  return (
                    <li
                      key={casa.nome}
                      data-index={i}
                      role="option"
                      aria-selected={i === highlight}
                      // mousedown em vez de click: o clique não pode tirar o foco
                      // do input antes de a escolha ser registrada.
                      onMouseDown={(e) => {
                        e.preventDefault();
                        escolher(casa);
                      }}
                      onMouseEnter={() => setHighlight(i)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
                        i === highlight ? "bg-white/[0.06]" : "",
                      )}
                    >
                      <CasaIcone casa={casa} />
                      <span className="min-w-0 flex-1 truncate font-semibold text-neutral-100">
                        {casa.nome}
                      </span>
                      <button
                        type="button"
                        aria-label={favorita ? "Remover dos favoritos" : "Favoritar"}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alternarFavorita(casa);
                        }}
                        className={cn(
                          "shrink-0 p-0.5 transition-colors",
                          favorita ? "text-emerald-400" : "text-neutral-600 hover:text-neutral-300",
                        )}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={favorita ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path
                            d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8 6.8 19.5l1-5.8-4.2-4.1 5.8-.8L12 3.5z"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>,
            document.body,
          )}
      </div>
    );
  },
);
