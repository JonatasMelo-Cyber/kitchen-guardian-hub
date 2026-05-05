import { Wind, Fuel, Droplets, Power, Hand, Bot } from "lucide-react";
import type { Actuator, ActuatorId } from "@/types/safety";
import { cn } from "@/lib/utils";

const meta: Record<ActuatorId, { icon: any; title: string }> = {
  ventilacao:  { icon: Wind,    title: "VENTILAÇÃO" },
  valvula_gas: { icon: Fuel,    title: "VÁLVULA GLP" },
  bomba:       { icon: Droplets,title: "BOMBA" },
  tomadas:     { icon: Power,   title: "TOMADAS" },
};

function visual(state: Actuator["state"]) {
  switch (state) {
    case "on":     return { label: "ATIVA",      color: "text-status-info",   ring: "bg-status-info",   on: true };
    case "open":   return { label: "ABERTA",     color: "text-status-gas",    ring: "bg-status-gas",    on: true };
    case "off":    return { label: "DESLIGADA",  color: "text-muted-foreground", ring: "bg-muted",      on: false };
    case "closed": return { label: "FECHADA",    color: "text-status-warning", ring: "bg-status-warning", on: false };
    case "cut":    return { label: "CORTADAS",   color: "text-status-danger", ring: "bg-status-danger", on: false };
  }
}

export function ActuatorGrid({
  actuators,
  manualOverrides = {},
  onToggle,
}: {
  actuators: Actuator[];
  manualOverrides?: Partial<Record<ActuatorId, boolean>>;
  onToggle?: (id: ActuatorId) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Atuadores</h2>
        <span className="text-[10px] text-muted-foreground">Estado dos dispositivos</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {actuators.map((a) => {
          const m = meta[a.id];
          const v = visual(a.state);
          const Icon = m.icon;
          const manual = !!manualOverrides[a.id];
          return (
            <div
              key={a.id}
              className={cn(
                "rounded-xl border bg-background/40 p-3 transition-all",
                v.on ? "border-current/30" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{m.title}</span>
                {manual ? (
                  <Hand className="h-3 w-3 text-status-warning" aria-label="Controle manual" />
                ) : (
                  <Bot className="h-3 w-3 text-muted-foreground/60" aria-label="Automático" />
                )}
              </div>
              <div className={cn("mx-auto my-2 flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 ring-1 ring-current/20", v.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className={cn("text-center text-[11px] font-bold tracking-wider", v.color)}>{v.label}</div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => onToggle?.(a.id)}
                  aria-label={`Alternar ${m.title}`}
                  className={cn("relative h-5 w-9 rounded-full transition-colors", v.on ? v.ring : "bg-muted")}
                >
                  <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all", v.on ? "left-[18px]" : "left-0.5")} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
