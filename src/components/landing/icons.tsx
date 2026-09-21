/**
 * Ícones da landing. Substituem os emojis da versão anterior, que mudavam de
 * desenho conforme o sistema do visitante e destoavam do resto da interface.
 */
type IconProps = { className?: string };

const BASE = "h-6 w-6";

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? BASE}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Bilhete de aposta, com o recorte do canhoto. */
export function TicketIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.2a2.3 2.3 0 0 0 0 4.6v1.2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.2a2.3 2.3 0 0 0 0-4.6Z" />
      <path d="M14 6.5v11" strokeDasharray="2 2.5" />
    </Svg>
  );
}

/** Barras em alta: os totais do painel. */
export function ChartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 19.5h16" />
      <rect x="5.5" y="12" width="3.4" height="5" rx="1" />
      <rect x="10.8" y="8.5" width="3.4" height="8.5" rx="1" />
      <rect x="16.1" y="5" width="3.4" height="12" rx="1" />
    </Svg>
  );
}

/** Calendário com o dia marcado. */
export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.8h17M8 3.5v3M16 3.5v3" />
      <circle cx="12" cy="14.6" r="1.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Duas pessoas: o cliente e a parte dele. */
export function ClientIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9.2" cy="8.6" r="3.1" />
      <path d="M3.6 19.4a5.8 5.8 0 0 1 11.2 0" />
      <path d="M16.2 6.2a3 3 0 0 1 0 5.6M17.4 14.4a5.2 5.2 0 0 1 3 5" />
    </Svg>
  );
}

/** Ficha de cassino, para os mercados. */
export function ChipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3.4v3.6M12 17v3.6M3.4 12H7M17 12h3.6" />
    </Svg>
  );
}

/** Calculadora do dutching. */
export function CalculatorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="3.2" width="14" height="17.6" rx="2.5" />
      <path d="M8.4 7.4h7.2" />
      <path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" strokeWidth="2.4" />
    </Svg>
  );
}
