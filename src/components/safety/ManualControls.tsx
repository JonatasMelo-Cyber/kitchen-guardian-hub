import { Wind, Fuel, Droplets, Power, Hand, Bot } from "lucide-react";
import type { Actuator, ActuatorId } from "@/types/safety";
import { cn } from "@/lib/utils";

const meta: Record<ActuatorId, { icon: any; title: string; onLabel: string; offLabel: string; activeColor: string }> = {
  ventilacao:  { icon: Wind,    title: "Ventilação",  onLabel: "Ligada",   offLabel: "Desligada", activeColor: "info" },
  valvula_gas: { icon: Fuel,    title: "Válvula GLP", onLabel: "Aberta",   offLabel: "Fechada",   activeColor: "gas" },
  bomba:       { icon: Droplets,title: "Bomba",       onLabel: "Ligada",   offLabel: "Desligada", activeColor: "info" },
  tomadas:     { icon: Power,   title: "Tomadas",     onLabel: "Ligadas",  offLabel: "Cortadas",  activeColor: "info" },
};

function isActive(a: Actuator) {
  // "on" or "open" = active/positive
  return a.state === "on" || a.state === "open";
}

export interface ManualControlsProps {
  actuators: Actuator[];
  manualOverrides: Partial<Record<ActuatorId, boolean>>;
  onToggle: (id: ActuatorId) => void;
}

export function ManualControls({ actuators, manualOverrides, onToggle }: ManualControlsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Controles Manuais</h2>
        </div>
        <span className="text-[10px] text-muted-foreground">Ação direta nos atuadores</span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {actuators.map((a) => {
          const m = meta[a.id];
          const active = isActive(a);
          const Icon = m.icon;
          const manual = !!manualOverrides[a.id];
          const colorClasses = active
            ? m.activeColor === "gas"
              ? "border-status-gas/60 bg-status-gas/10 text-status-gas glow-info"
              : "border-status-info/60 bg-status-info/10 text-status-info glow-info"
            : "border-border bg-background/40 text-muted-foreground";

          return (
            <button
              key={a.id}
              onClick={() => onToggle(a.id)}
              className={cn(
                "group relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
                colorClasses,
              )}
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                active ? "bg-foreground/5 ring-1 ring-current/30" : "bg-background/40")}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
                  {m.title}
                  {manual ? (
                    <Hand className="h-3 w-3 text-status-warning" aria-label="Manual" />
                  ) : (
                    <Bot className="h-3 w-3 text-muted-foreground/70" aria-label="Automático" />
                  )}
                </div>
                <div className={cn("text-[10px] font-semibold", active ? "text-current" : "text-muted-foreground")}>
                  {active ? m.onLabel : m.offLabel}
                </div>
              </div>
              <div className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                active ? (m.activeColor === "gas" ? "bg-status-gas" : "bg-status-info") : "bg-muted"
              )}>
                <span className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all",
                  active ? "left-[18px]" : "left-0.5"
                )} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
