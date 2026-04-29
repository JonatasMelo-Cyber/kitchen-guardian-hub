import { BellRing, Activity, BellOff } from "lucide-react";
import type { SimAction } from "./SimulationControls";

export function QuickControls({ onAction }: { onAction: (a: SimAction | "alarm" | "test" | "clear") => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold tracking-wide">CONTROLES RÁPIDOS</h2>
      <p className="mb-3 text-[11px] text-muted-foreground">Ações manuais de emergência</p>
      <div className="space-y-2">
        <button
          onClick={() => onAction("test")}
          className="flex w-full items-center gap-3 rounded-xl bg-status-info px-4 py-3 text-left text-status-info-foreground transition-transform hover:scale-[1.01]"
        >
          <Activity className="h-5 w-5" />
          <div>
            <div className="text-sm font-bold tracking-wide">TESTAR SISTEMA</div>
            <div className="text-[11px] opacity-90">Verifica todos os sensores</div>
          </div>
        </button>
        <button
          onClick={() => onAction("clear")}
          className="flex w-full items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-left text-secondary-foreground transition-transform hover:scale-[1.01]"
        >
          <BellOff className="h-5 w-5" />
          <div>
            <div className="text-sm font-bold tracking-wide">LIMPAR ALERTAS</div>
            <div className="text-[11px] opacity-80">Reinicia notificações visuais</div>
          </div>
        </button>
      </div>
    </div>
  );
}
