import { Siren } from "lucide-react";

export function EmergencyButton({ onClick, active = false }: { onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? "Desativar emergência" : "Acionar emergência"}
      aria-pressed={active}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 border-status-danger/70 bg-gradient-to-br from-status-danger to-status-critical px-4 py-4 text-status-danger-foreground shadow-[0_10px_30px_-8px_hsl(var(--status-danger)/0.7)] transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-[0_14px_40px_-8px_hsl(var(--status-danger)/0.9)] active:scale-[0.99]"
    >
      <span className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${active ? "pulse-danger opacity-100" : "opacity-70"}`} aria-hidden />
      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-2 ring-white/30 transition-all duration-300">
        <Siren className={active ? "h-7 w-7 blink-critical" : "h-7 w-7"} />
      </span>
      <span className="relative z-10 flex-1 text-left">
        <span className="block text-lg font-extrabold leading-none tracking-[0.18em] transition-all duration-300">
          {active ? "DESATIVAR" : "EMERGÊNCIA"}
        </span>
        <span className="mt-1 block text-[10px] font-medium tracking-wide opacity-95 transition-opacity duration-300">
          {active ? "Emergência ativa — clique para desativar" : "Acionar todos os protocolos de segurança"}
        </span>
      </span>
      <span className="relative z-10 hidden md:block text-[10px] font-bold uppercase tracking-widest opacity-90">
        {active ? "Ativo" : "Pressione"}
      </span>
    </button>
  );
}
