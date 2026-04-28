import { AlertTriangle, CheckCircle2, Flame, Siren, Wind } from "lucide-react";
import type { SystemStatus } from "@/types/safety";
import { statusMeta } from "@/lib/safety-engine";
import { cn } from "@/lib/utils";

const icons = {
  normal: CheckCircle2,
  alert: AlertTriangle,
  fire: Flame,
  explosion: Wind,
  emergency: Siren,
};

const ringByStatus: Record<SystemStatus, string> = {
  normal: "bg-status-normal/15 border-status-normal/40 text-status-normal",
  alert: "bg-status-warning/15 border-status-warning/50 text-status-warning pulse-warning",
  fire: "bg-status-danger/15 border-status-danger/60 text-status-danger pulse-danger",
  explosion: "bg-status-danger/15 border-status-danger/60 text-status-danger pulse-danger",
  emergency: "bg-status-critical/20 border-status-critical/70 text-status-critical blink-critical",
};

export function StatusBanner({ status }: { status: SystemStatus }) {
  const meta = statusMeta(status);
  const Icon = icons[status];
  return (
    <div className={cn("flex items-center gap-4 rounded-2xl border-2 p-5 backdrop-blur-sm", ringByStatus[status])}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-background/40">
        <Icon className="h-8 w-8" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80">Estado do Sistema</div>
        <div className="text-2xl font-bold leading-tight">{meta.label}</div>
        <div className="text-sm text-foreground/80">{meta.message}</div>
      </div>
    </div>
  );
}
