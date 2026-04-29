import { BellRing } from "lucide-react";

export function EmergencyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-status-danger px-6 py-5 text-status-danger-foreground shadow-[var(--shadow-panel)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-status-danger via-status-danger to-status-critical opacity-90" />
      <div className="pointer-events-none absolute inset-0 pulse-danger" />
      <BellRing className="relative z-10 h-10 w-10 md:h-12 md:w-12" />
      <div className="relative z-10 text-left">
        <div className="text-xl md:text-3xl font-extrabold tracking-widest leading-none">
          EMERGÊNCIA
        </div>
        <div className="mt-1 text-xs md:text-sm font-medium opacity-95 tracking-wide">
          Aciona todos os protocolos de segurança imediatamente
        </div>
      </div>
    </button>
  );
}
