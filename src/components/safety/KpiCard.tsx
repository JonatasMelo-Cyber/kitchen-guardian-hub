import { Flame, Wind, Fuel, PersonStanding } from "lucide-react";
import type { Sensor } from "@/types/safety";
import { cn } from "@/lib/utils";

const meta = {
  S_calor:    { icon: Flame, title: "TEMPERATURA", iconColor: "text-status-warning" },
  S_fumaca:   { icon: Wind,  title: "FUMAÇA",      iconColor: "text-status-danger" },
  S_GLP:      { icon: Fuel,  title: "GÁS GLP",     iconColor: "text-status-gas" },
  S_movimento:{ icon: PersonStanding, title: "MOVIMENTO", iconColor: "text-status-info" },
} as const;

const stateLabel = {
  ok: { label: "NORMAL", color: "text-status-normal", border: "card-state-ok" },
  warning: { label: "ALERTA", color: "text-status-warning", border: "card-state-warning" },
  danger: { label: "PERIGO", color: "text-status-danger", border: "card-state-danger" },
} as const;

export function KpiCard({ sensor }: { sensor: Sensor }) {
  const m = meta[sensor.id];
  const Icon = m.icon;
  const st = stateLabel[sensor.state];
  const display =
    sensor.id === "S_movimento"
      ? sensor.value > 0 ? "ATIVO" : "OCIOSO"
      : `${Math.round(sensor.value)}`;
  const sub = sensor.id === "S_movimento"
    ? sensor.value > 0 ? "DETECTADO" : "AUSENTE"
    : st.label;

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all duration-300",
      st.border,
    )}>
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 ring-1 ring-border", m.iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{m.title}</div>
        <div className={cn("text-2xl font-extrabold leading-tight tabular-nums", st.color)}>
          {display}
          {sensor.id !== "S_movimento" && <span className="ml-1 text-sm font-semibold text-muted-foreground">{sensor.unit}</span>}
        </div>
        <div className={cn("text-[10px] font-bold tracking-widest", st.color)}>{sub}</div>
      </div>
    </div>
  );
}
