import { Siren } from "lucide-react";

export function EmergencyButton({ onClick, active = false }: { onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label="Acionar emergência"
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 border-status-danger/70 bg-gradient-to-br from-status-danger to-status-critical px-4 py-4 text-status-danger-foreground shadow-[0_10px_30px_-8px_hsl(var(--status-danger)/0.7)] transition-all duration-200 hover:scale-[1.015] hover:shadow-[0_14px_40px_-8px_hsl(var(--status-danger)/0.9)] active:scale-[0.99]"
    >
      <span className="pointer-events-none absolute inset-0 pulse-danger opacity-90" aria-hidden />
      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-2 ring-white/30">
        <Siren className={active ? "h-7 w-7 blink-critical" : "h-7 w-7"} />
      </span>
      <span className="relative z-10 flex-1 text-left">
        <span className="block text-lg font-extrabold leading-none tracking-[0.18em]">EMERGÊNCIA</span>
        <span className="mt-1 block text-[10px] font-medium tracking-wide opacity-95">
          Acionar todos os protocolos de segurança
        </span>
      </span>
      <span className="relative z-10 hidden md:block text-[10px] font-bold uppercase tracking-widest opacity-90">
        Pressione
      </span>
    </button>
  );
}
