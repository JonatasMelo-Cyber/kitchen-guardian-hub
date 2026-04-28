import { Flame, Wind, Fuel, PersonStanding } from "lucide-react";
import type { Sensor } from "@/types/safety";
import { cn } from "@/lib/utils";

const meta = {
  S_calor:    { icon: Flame, title: "S. CALOR",    bg: "bg-status-warning/15",  iconBg: "bg-status-warning/25  text-status-warning" },
  S_fumaca:   { icon: Wind,  title: "S. FUMAÇA",   bg: "bg-status-danger/10",   iconBg: "bg-status-danger/20   text-status-danger" },
  S_GLP:      { icon: Fuel,  title: "S. GLP",      bg: "bg-status-normal/10",   iconBg: "bg-status-normal/20   text-status-normal" },
  S_movimento:{ icon: PersonStanding, title: "S. MOVIMENTO", bg: "bg-status-info/10", iconBg: "bg-status-info/20 text-status-info" },
} as const;

const stateLabel = {
  ok: { label: "NORMAL", color: "text-status-normal" },
  warning: { label: "ALERTA", color: "text-status-warning" },
  danger: { label: "PERIGO", color: "text-status-danger" },
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
    <div className={cn("flex items-center gap-3 rounded-2xl border border-border bg-card p-4", m.bg)}>
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", m.iconBg)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{m.title}</div>
        <div className={cn("text-2xl font-extrabold leading-tight tabular-nums", st.color)}>
          {display}
          {sensor.id !== "S_movimento" && <span className="ml-1 text-sm font-semibold text-muted-foreground">{sensor.unit}</span>}
        </div>
        <div className={cn("text-[10px] font-bold tracking-widest", st.color)}>{sub}</div>
      </div>
    </div>
  );
}
