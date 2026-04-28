import { Flame, AlertTriangle, Users } from "lucide-react";
import type { SystemStatus, Sensor } from "@/types/safety";
import { statusMeta } from "@/lib/safety-engine";
import { cn } from "@/lib/utils";

const colorMap: Record<SystemStatus, { ring: string; text: string; arc: number }> = {
  normal: { ring: "stroke-status-normal", text: "text-status-normal", arc: 100 },
  alert: { ring: "stroke-status-warning", text: "text-status-warning", arc: 65 },
  fire: { ring: "stroke-status-danger", text: "text-status-danger", arc: 30 },
  explosion: { ring: "stroke-status-danger", text: "text-status-danger", arc: 25 },
  emergency: { ring: "stroke-status-critical", text: "text-status-critical", arc: 10 },
};

export function SystemStatusCard({ status, sensors }: { status: SystemStatus; sensors: Sensor[] }) {
  const meta = statusMeta(status);
  const c = colorMap[status];
  const fire = sensors.find((s) => s.id === "S_calor")!.state === "danger" || status === "fire";
  const exp = sensors.find((s) => s.id === "S_GLP")!.state !== "ok";
  const people = sensors.find((s) => s.id === "S_movimento")!.value > 0;

  const r = 42;
  const C = 2 * Math.PI * r;
  const offset = C - (c.arc / 100) * C;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold tracking-wide">STATUS DO SISTEMA</h2>
      <p className="mb-3 text-[11px] text-muted-foreground">Resumo geral da situação</p>

      <div className="flex items-center gap-4">
        <div className="relative h-[110px] w-[110px] shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
              className={cn("transition-all duration-700", c.ring)}
              strokeDasharray={C} strokeDashoffset={offset}
            />
          </svg>
        </div>
        <div>
          <div className={cn("text-2xl font-extrabold leading-tight", c.text)}>{meta.label.toUpperCase()}</div>
          <div className="text-xs text-muted-foreground max-w-[180px]">{meta.message}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Row icon={Flame} label="Incêndio" value={fire ? "ATIVO" : "INATIVO"} active={fire} />
        <Row icon={AlertTriangle} label="Risco de Explosão" value={exp ? "ALTO" : "BAIXO"} active={exp} />
        <Row icon={Users} label="Pessoas no Local" value={people ? "SIM" : "NÃO"} active={people} info />
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, active, info }: { icon: any; label: string; value: string; active: boolean; info?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
      <div className="flex items-center gap-2 text-xs">
        <Icon className={cn("h-4 w-4", active ? (info ? "text-status-info" : "text-status-danger") : "text-muted-foreground")} />
        <span className="text-foreground/90">{label}:</span>
      </div>
      <span className={cn("text-xs font-bold tracking-wider", active ? (info ? "text-status-info" : "text-status-danger") : "text-status-normal")}>{value}</span>
    </div>
  );
}
