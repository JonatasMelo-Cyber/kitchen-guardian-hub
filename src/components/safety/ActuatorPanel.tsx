import { Wind, Fuel, Droplets, Plug } from "lucide-react";
import type { Actuator } from "@/types/safety";
import { cn } from "@/lib/utils";

const icons = { ventilacao: Wind, valvula_gas: Fuel, bomba: Droplets, tomadas: Plug } as const;

function visual(state: Actuator["state"]) {
  switch (state) {
    case "on": return { label: "Ligado", chip: "bg-status-info/15 text-status-info border-status-info/50", dot: "bg-status-info" };
    case "open": return { label: "Aberta", chip: "bg-status-normal/15 text-status-normal border-status-normal/50", dot: "bg-status-normal" };
    case "off": return { label: "Desligado", chip: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" };
    case "closed": return { label: "Fechada", chip: "bg-status-danger/15 text-status-danger border-status-danger/50", dot: "bg-status-danger" };
    case "cut": return { label: "Cortada", chip: "bg-status-danger/15 text-status-danger border-status-danger/50", dot: "bg-status-danger" };
  }
}

export function ActuatorPanel({ actuators }: { actuators: Actuator[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Atuadores</h2>
      <div className="grid grid-cols-2 gap-3">
        {actuators.map((a) => {
          const Icon = icons[a.id];
          const v = visual(a.state);
          return (
            <div key={a.id} className="rounded-xl border border-border bg-background/40 p-3">
              <div className="flex items-start justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", v.chip)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase", v.chip)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", v.dot)} />
                  {v.label}
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold leading-tight">{a.label}</div>
              <div className="text-[11px] text-muted-foreground">{a.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
