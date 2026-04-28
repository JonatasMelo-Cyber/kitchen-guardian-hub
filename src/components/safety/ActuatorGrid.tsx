import { Wind, Fuel, Droplets, Power } from "lucide-react";
import type { Actuator } from "@/types/safety";
import { cn } from "@/lib/utils";

const icons = { ventilacao: Wind, valvula_gas: Fuel, bomba: Droplets, tomadas: Power } as const;
const titles = {
  ventilacao: "VENTILAÇÃO",
  valvula_gas: "VÁLVULA DE GÁS",
  bomba: "BOMBA (HIDRANTE)",
  tomadas: "TOMADAS",
} as const;

function visual(state: Actuator["state"]) {
  switch (state) {
    case "on": return { label: "ATIVADA", color: "text-status-info", on: true, ring: "bg-status-info" };
    case "open": return { label: "ABERTA", color: "text-status-normal", on: true, ring: "bg-status-normal" };
    case "off": return { label: "DESLIGADA", color: "text-muted-foreground", on: false, ring: "bg-muted-foreground" };
    case "closed": return { label: "FECHADA", color: "text-status-danger", on: true, ring: "bg-status-danger" };
    case "cut": return { label: "DESLIGADAS", color: "text-status-danger", on: false, ring: "bg-status-danger" };
  }
}

export function ActuatorGrid({ actuators }: { actuators: Actuator[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold tracking-wide">ATUADORES</h2>
      <p className="mb-3 text-[11px] text-muted-foreground">Status dos dispositivos de ação</p>
      <div className="grid grid-cols-2 gap-3">
        {actuators.map((a) => {
          const Icon = icons[a.id];
          const v = visual(a.state);
          return (
            <div key={a.id} className="rounded-xl border border-border bg-background/40 p-3 text-center">
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground">{titles[a.id]}</div>
              <div className={cn("mx-auto my-2 flex h-12 w-12 items-center justify-center rounded-full bg-background/60", v.color)}>
                <Icon className="h-6 w-6" />
              </div>
              <div className={cn("text-xs font-bold tracking-wider", v.color)}>{v.label}</div>
              <div className="mt-2 flex justify-center">
                <Toggle on={v.on} ringColor={v.ring} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({ on, ringColor }: { on: boolean; ringColor: string }) {
  return (
    <div className={cn("relative h-5 w-9 rounded-full transition-colors", on ? ringColor : "bg-muted")}>
      <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
    </div>
  );
}
