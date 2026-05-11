import { Flame, Activity, ShieldCheck, Cpu, Wifi } from "lucide-react";
import type { SystemStatus } from "@/types/safety";
import { cn } from "@/lib/utils";

const statusDot: Record<SystemStatus, string> = {
  normal: "bg-status-normal",
  alert: "bg-status-warning",
  fire: "bg-status-danger",
  explosion: "bg-status-danger",
  emergency: "bg-status-critical",
};

const statusLabel: Record<SystemStatus, string> = {
  normal: "Operacional",
  alert: "Em alerta",
  fire: "Incêndio",
  explosion: "Risco GLP",
  emergency: "Emergência",
};

export function Sidebar({
  time,
  date,
  status = "normal",
  sensorsOnline = 4,
  totalSensors = 4,
}: {
  time: string;
  date: string;
  status?: SystemStatus;
  sensorsOnline?: number;
  totalSensors?: number;
}) {
  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col bg-sidebar p-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-danger/10 ring-1 ring-status-danger/30">
          <Flame className="h-5 w-5 text-status-danger" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-extrabold tracking-wide text-sidebar-foreground">SAFEKITCHEN</div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Industrial Safety</div>
        </div>
      </div>

      {/* System info — compact */}
      <div className="space-y-2">
        <div className="rounded-xl border border-sidebar-border bg-card/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Sistema</span>
            <span className={cn("h-2 w-2 rounded-full", statusDot[status], status !== "normal" && "animate-pulse")} />
          </div>
          <div className="text-sm font-bold text-foreground">{statusLabel[status]}</div>
          <div className="mt-2 font-mono text-base font-bold tabular-nums text-foreground">{time}</div>
          <div className="text-[10px] text-muted-foreground">{date}</div>
        </div>

        <InfoRow icon={Activity} label="Sensores" value={`${sensorsOnline}/${totalSensors}`} ok={sensorsOnline === totalSensors} />
        <InfoRow icon={Wifi} label="Conexão" value="Online" ok />
        <InfoRow icon={Cpu} label="Controlador" value="OK" ok />
        <InfoRow icon={ShieldCheck} label="Brigada" value="Pronta" ok />
      </div>

      <div className="flex-1" />

      <div className="rounded-xl border border-sidebar-border bg-card/40 p-2.5">
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Versão</div>
        <div className="text-[11px] font-mono text-foreground/80">v2.4.0 · build 240</div>
      </div>
    </aside>
  );
}

function InfoRow({ icon: Icon, label, value, ok }: { icon: any; label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-sidebar-border/60 bg-card/30 px-3 py-1.5">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className={cn("text-[11px] font-bold tabular-nums", ok ? "text-status-normal" : "text-status-warning")}>{value}</span>
    </div>
  );
}
