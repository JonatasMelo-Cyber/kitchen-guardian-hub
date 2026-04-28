import { Flame, Wind, Fuel, Activity } from "lucide-react";
import type { Sensor } from "@/types/safety";
import { cn } from "@/lib/utils";

const icons = { S_calor: Flame, S_fumaca: Wind, S_GLP: Fuel, S_movimento: Activity } as const;

const stateStyle = {
  ok: { bar: "bg-status-normal", text: "text-status-normal", chip: "bg-status-normal/15 text-status-normal border-status-normal/40", label: "Normal" },
  warning: { bar: "bg-status-warning", text: "text-status-warning", chip: "bg-status-warning/15 text-status-warning border-status-warning/40", label: "Alerta" },
  danger: { bar: "bg-status-danger", text: "text-status-danger", chip: "bg-status-danger/15 text-status-danger border-status-danger/50", label: "Crítico" },
} as const;

const maxByType: Record<Sensor["id"], number> = {
  S_calor: 100,
  S_fumaca: 60,
  S_GLP: 1500,
  S_movimento: 1,
};

export function SensorPanel({ sensors }: { sensors: Sensor[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Sensores</h2>
      <div className="space-y-3">
        {sensors.map((s) => {
          const Icon = icons[s.id];
          const st = stateStyle[s.state];
          const pct = Math.min(100, (s.value / maxByType[s.id]) * 100);
          return (
            <div key={s.id} className="rounded-xl border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", st.chip, "border")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-[11px] text-muted-foreground">{s.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("text-lg font-bold tabular-nums", st.text)}>
                    {s.id === "S_movimento" ? (s.value > 0 ? "Detectado" : "Ausente") : `${s.value}${s.unit}`}
                  </div>
                  <span className={cn("inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase", st.chip)}>{st.label}</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full transition-all duration-500", st.bar)} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
