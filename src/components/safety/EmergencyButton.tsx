import { BellRing } from "lucide-react";

export function EmergencyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-full min-h-[180px] w-full items-center justify-center gap-5 overflow-hidden rounded-2xl bg-status-danger px-8 py-8 text-status-danger-foreground shadow-[var(--shadow-panel)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-status-danger via-status-danger to-status-critical opacity-90" />
      <div className="pointer-events-none absolute inset-0 pulse-danger" />
      <BellRing className="relative z-10 h-16 w-16 md:h-20 md:w-20" />
      <div className="relative z-10 text-left">
        <div className="text-3xl md:text-5xl font-extrabold tracking-widest leading-none">
          EMERGÊNCIA
        </div>
        <div className="mt-2 text-sm md:text-base font-medium opacity-95 tracking-wide">
          Aciona todos os protocolos de segurança imediatamente
        </div>
      </div>
    </button>
  );
}
