import { Siren, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmergencyButton({ onClick, active = false }: { onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? "Cancelar emergência" : "Ativar emergência"}
      aria-pressed={active}
      className={cn(
        "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 px-4 py-4 transition-all duration-200 hover:scale-[1.015] active:scale-[0.99]",
        active
          ? "border-status-danger/70 bg-gradient-to-br from-status-danger to-status-critical text-status-danger-foreground shadow-[0_10px_30px_-8px_hsl(var(--status-danger)/0.7)] hover:shadow-[0_14px_40px_-8px_hsl(var(--status-danger)/0.9)]"
          : "border-status-normal/50 bg-gradient-to-br from-secondary to-card text-foreground shadow-[0_8px_24px_-12px_hsl(var(--status-normal)/0.5)] hover:border-status-normal/80",
      )}
    >
      {active && (
        <span className="pointer-events-none absolute inset-0 pulse-danger opacity-90" aria-hidden />
      )}
      <span
        className={cn(
          "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl ring-2",
          active ? "bg-white/15 ring-white/30" : "bg-status-normal/10 ring-status-normal/40",
        )}
      >
        {active ? (
          <Siren className="h-7 w-7 blink-critical" />
        ) : (
          <ShieldCheck className="h-7 w-7 text-status-normal" />
        )}
      </span>
      <span className="relative z-10 flex-1 text-left">
        <span className="block text-lg font-extrabold leading-none tracking-[0.18em]">
          {active ? "CANCELAR EMERGÊNCIA" : "ATIVAR EMERGÊNCIA"}
        </span>
        <span className="mt-1 block text-[10px] font-medium tracking-wide opacity-90">
          {active
            ? "Clique para desativar protocolos de segurança"
            : "Acionar todos os protocolos de segurança"}
        </span>
      </span>
    </button>
  );
}
