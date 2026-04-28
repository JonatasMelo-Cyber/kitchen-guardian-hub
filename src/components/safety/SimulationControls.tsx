import { Button } from "@/components/ui/button";
import { Flame, Fuel, Wind, Activity, RotateCcw, Siren, Play, Pause } from "lucide-react";

export type SimAction = "fire" | "gas" | "smoke" | "motion" | "reset" | "emergency" | "toggleAuto";

export function SimulationControls({ onAction, autoMode }: { onAction: (a: SimAction) => void; autoMode: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Simulação</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="justify-start" onClick={() => onAction("fire")}>
          <Flame className="mr-2 h-4 w-4 text-status-danger" /> Incêndio
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => onAction("gas")}>
          <Fuel className="mr-2 h-4 w-4 text-env-gas" /> Vazamento GLP
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => onAction("smoke")}>
          <Wind className="mr-2 h-4 w-4 text-status-warning" /> Fumaça
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => onAction("motion")}>
          <Activity className="mr-2 h-4 w-4 text-primary" /> Movimento
        </Button>
        <Button variant="destructive" className="justify-start" onClick={() => onAction("emergency")}>
          <Siren className="mr-2 h-4 w-4" /> Emergência
        </Button>
        <Button variant="secondary" className="justify-start" onClick={() => onAction("reset")}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button variant="ghost" className="col-span-2 justify-start border border-border" onClick={() => onAction("toggleAuto")}>
          {autoMode ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          Modo automático: {autoMode ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
