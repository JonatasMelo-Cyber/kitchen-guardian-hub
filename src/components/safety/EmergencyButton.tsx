import { BellRing } from "lucide-react";

export function EmergencyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-status-danger/60 bg-status-danger px-4 py-5 text-status-danger-foreground shadow-[0_0_30px_-5px_hsl(var(--status-danger)/0.6)] ring-4 ring-status-danger/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-status-danger via-status-danger to-status-critical opacity-95" />
      <div className="pointer-events-none absolute inset-0 pulse-danger" />
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-status-danger-foreground/15 ring-2 ring-status-danger-foreground/40">
        <BellRing className="h-7 w-7" />
      </div>
      <div className="relative z-10 text-center">
        <div className="text-xl font-extrabold tracking-[0.2em] leading-none">
          EMERGÊNCIA
        </div>
        <div className="mt-1.5 text-[10px] font-medium opacity-95 tracking-wide">
          Aciona todos os protocolos de segurança
        </div>
      </div>
    </button>
  );
}
