import { Flame, ChefHat, Wind, Fuel, Archive, Activity, Droplets, Plug, ShieldCheck, Radio } from "lucide-react";
import type { Sensor, Actuator, SystemStatus } from "@/types/safety";
import { cn } from "@/lib/utils";

const sensorIcon = {
  S_calor: Flame,
  S_fumaca: Wind,
  S_GLP: Fuel,
  S_movimento: Activity,
} as const;

const sensorColor = {
  ok: "bg-status-normal text-status-normal-foreground glow-normal",
  warning: "bg-status-warning text-status-warning-foreground pulse-warning",
  danger: "bg-status-danger text-status-danger-foreground pulse-danger",
} as const;

const actuatorIcon = {
  ventilacao: Wind,
  valvula_gas: Fuel,
  bomba: Droplets,
  tomadas: Plug,
} as const;

function actuatorVisual(state: Actuator["state"]) {
  if (state === "on" || state === "open") return "bg-status-info text-status-info-foreground glow-normal";
  if (state === "closed" || state === "cut") return "bg-status-danger text-status-danger-foreground pulse-danger";
  return "bg-muted text-muted-foreground";
}

export function KitchenPlant({
  sensors,
  actuators,
  status,
}: {
  sensors: Sensor[];
  actuators: Actuator[];
  status: SystemStatus;
}) {
  const overlay =
    status === "fire" || status === "explosion"
      ? "before:bg-status-danger/10"
      : status === "alert"
      ? "before:bg-status-warning/5"
      : status === "emergency"
      ? "before:bg-status-critical/15"
      : "before:bg-transparent";

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-border bg-card grid-floor",
        "before:pointer-events-none before:absolute before:inset-0 before:transition-colors before:duration-500",
        overlay,
      )}
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      {/* Title */}
      <div className="absolute left-4 top-3 z-20 flex items-center gap-2 rounded-lg bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Planta da Cozinha — Monitoramento
      </div>

      {/* Environments */}
      <Zone style={{ left: "2%", top: "20%", width: "32%", height: "55%" }} gradient="var(--gradient-stove)" border="hsl(var(--env-stove))" icon={Flame} title="Fogão" />
      <Zone style={{ left: "36%", top: "30%", width: "36%", height: "55%" }} gradient="var(--gradient-prep)" border="hsl(var(--env-prep))" icon={ChefHat} title="Área de Preparo" />
      <Zone style={{ left: "2%", top: "2%", width: "70%", height: "16%" }} gradient="var(--gradient-vent)" border="hsl(var(--env-vent))" icon={Wind} title="Ventilação / Coifa" />
      <Zone style={{ left: "74%", top: "55%", width: "24%", height: "40%" }} gradient="var(--gradient-gas)" border="hsl(var(--env-gas))" icon={Fuel} title="Central de Gás" />
      <Zone style={{ left: "74%", top: "2%", width: "24%", height: "50%" }} gradient="var(--gradient-storage)" border="hsl(var(--env-storage))" icon={Archive} title="Armazenamento" />

      {/* Sensors */}
      {sensors.map((s) => {
        const Icon = sensorIcon[s.id];
        return (
          <div
            key={s.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.position.x}%`, top: `${s.position.y}%` }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2 border-background/40 transition-all", sensorColor[s.state])}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
                {s.id}
              </div>
            </div>
          </div>
        );
      })}

      {/* Actuators */}
      {actuators.map((a) => {
        const Icon = actuatorIcon[a.id];
        return (
          <div
            key={a.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${a.position.x}%`, top: `${a.position.y}%` }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-md border-2 border-background/40 transition-all", actuatorVisual(a.state))}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
                {a.label.split(" ")[0]}
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1 rounded-lg bg-background/75 p-2 text-[10px] backdrop-blur">
        <div className="mb-1 flex items-center gap-1 font-semibold uppercase tracking-wider"><Radio className="h-3 w-3" /> Legenda</div>
        <LegendDot color="bg-status-normal" label="Normal" />
        <LegendDot color="bg-status-warning" label="Alerta" />
        <LegendDot color="bg-status-danger" label="Crítico" />
        <LegendDot color="bg-status-info" label="Atuador ativo" />
      </div>
    </div>
  );
}

function Zone({
  style,
  gradient,
  border,
  icon: Icon,
  title,
}: {
  style: React.CSSProperties;
  gradient: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div
      className="absolute rounded-xl border-2 backdrop-blur-[2px]"
      style={{ ...style, background: gradient, borderColor: `${border}66` }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: border }}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}
