import { Flame, Wind, Fuel, ChefHat, Archive, DoorOpen, Snowflake, Droplets } from "lucide-react";
import type { Sensor, SystemStatus } from "@/types/safety";
import { cn } from "@/lib/utils";
import kitchenImg from "@/assets/kitchen-isometric.jpg";

const labelByZone = {
  stove: { label: "COZIMENTO", icon: Flame, color: "bg-status-danger text-status-danger-foreground" },
  prep: { label: "PREPARO", icon: ChefHat, color: "bg-status-info text-status-info-foreground" },
  vent: { label: "VENTILAÇÃO", icon: Wind, color: "bg-status-info text-status-info-foreground" },
  gas: { label: "GÁS", icon: Fuel, color: "bg-status-normal text-status-normal-foreground" },
  storage: { label: "ARMAZENAMENTO", icon: Archive, color: "bg-status-info text-status-info-foreground" },
  cold: { label: "CÂMARA FRIA", icon: Snowflake, color: "bg-status-info text-status-info-foreground" },
  sink: { label: "PIA", icon: Droplets, color: "bg-status-info text-status-info-foreground" },
} as const;

const zones: Array<{ key: keyof typeof labelByZone; x: number; y: number }> = [
  { key: "vent", x: 30, y: 12 },
  { key: "stove", x: 36, y: 38 },
  { key: "prep", x: 50, y: 56 },
  { key: "gas", x: 86, y: 60 },
  { key: "storage", x: 70, y: 86 },
  { key: "cold", x: 14, y: 70 },
  { key: "sink", x: 78, y: 40 },
];

const sensorDot = {
  ok: "bg-status-normal ring-status-normal/40",
  warning: "bg-status-warning ring-status-warning/40 pulse-warning",
  danger: "bg-status-danger ring-status-danger/50 pulse-danger",
} as const;

export function KitchenView({ sensors, status }: { sensors: Sensor[]; status: SystemStatus }) {
  const overlay =
    status === "fire" || status === "explosion"
      ? "from-status-danger/20"
      : status === "alert"
      ? "from-status-warning/15"
      : status === "emergency"
      ? "from-status-critical/25"
      : "from-transparent";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-panel)]">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">PLANTA DA COZINHA INDUSTRIAL</h2>
          <p className="text-xs text-muted-foreground">Monitoramento em tempo real dos ambientes</p>
        </div>
      </div>

      <div className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-[#0F1729]">
        <img
          src={kitchenImg}
          alt="Planta isométrica da cozinha industrial com fogões, coifa, área de preparo, armazenamento e cilindro de GLP"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />

        {/* Status tint */}
        <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent transition-colors duration-500", overlay)} />

        {/* Zone tags */}
        {zones.map((z) => {
          const m = labelByZone[z.key];
          const Icon = m.icon;
          return (
            <div
              key={z.key}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur",
                m.color,
              )}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
            >
              <Icon className="h-3 w-3" />
              {m.label}
            </div>
          );
        })}

        {/* Exit marker */}
        <div className="absolute right-[8%] top-[28%] -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-status-normal px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-status-normal-foreground shadow-lg">
          <DoorOpen className="h-3 w-3" /> Saída
        </div>

        {/* Sensor dots */}
        {sensors.map((s) => (
          <div
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.position.x}%`, top: `${s.position.y}%` }}
          >
            <div className={cn("h-3.5 w-3.5 rounded-full ring-4", sensorDot[s.state])} />
            <div className="mt-1 -translate-x-1/2 left-1/2 absolute whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 text-[9px] font-bold tracking-wide backdrop-blur">
              {s.id}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-background/85 px-3 py-1.5 text-[10px] font-medium backdrop-blur">
          <Dot color="bg-status-normal" label="Normal" />
          <Dot color="bg-status-warning" label="Alerta" />
          <Dot color="bg-status-danger" label="Perigo" />
          <Dot color="bg-muted-foreground" label="Desligado" />
          <Dot color="bg-status-info" label="Ativo" />
        </div>
      </div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", color)} /> {label}
    </span>
  );
}
