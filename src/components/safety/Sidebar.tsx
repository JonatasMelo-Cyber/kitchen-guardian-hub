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
    <aside className="hidden lg:flex w-[208px] shrink-0 flex-col bg-sidebar px-3 py-4">
      {/* Logo — top-left, aligned */}
      <div className="flex items-center gap-2.5 px-1 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-danger/10 ring-1 ring-status-danger/30">
          <Flame className="h-4.5 w-4.5 text-status-danger" />
        </div>
        <div className="leading-tight">
          <div className="text-[12px] font-extrabold tracking-wide text-sidebar-foreground">SAFEKITCHEN</div>
          <div className="text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground">Industrial Safety</div>
        </div>
      </div>

      {/* Status card — compact */}
      <div className="rounded-xl border border-sidebar-border bg-card/60 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">Sistema</span>
          <span className={cn("h-2 w-2 rounded-full", statusDot[status], status !== "normal" && "animate-pulse")} />
        </div>
        <div className="text-[13px] font-bold text-foreground">{statusLabel[status]}</div>
        <div className="mt-1.5 font-mono text-[15px] font-bold leading-none tabular-nums text-foreground">{time}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">{date}</div>
      </div>

      <div className="flex-1" />
    </aside>
  );
}

function InfoRow({ icon: Icon, label, value, ok }: { icon: any; label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-sidebar-border/60 bg-card/30 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <span className={cn("text-[10.5px] font-bold tabular-nums", ok ? "text-status-normal" : "text-status-warning")}>{value}</span>
    </div>
  );
}
