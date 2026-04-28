import { AlertTriangle, Info, Siren, TriangleAlert } from "lucide-react";
import type { AlertMessage } from "@/types/safety";
import { cn } from "@/lib/utils";

const config = {
  info: { icon: Info, cls: "border-status-info/40 bg-status-info/10 text-status-info" },
  warning: { icon: TriangleAlert, cls: "border-status-warning/50 bg-status-warning/10 text-status-warning" },
  danger: { icon: AlertTriangle, cls: "border-status-danger/50 bg-status-danger/10 text-status-danger" },
  critical: { icon: Siren, cls: "border-status-critical/60 bg-status-critical/15 text-status-critical blink-critical" },
} as const;

export function AlertsLog({ alerts }: { alerts: AlertMessage[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Mensagens de Alerta</h2>
      <div className="space-y-2">
        {alerts.map((a) => {
          const { icon: Icon, cls } = config[a.level];
          return (
            <div key={a.id} className={cn("flex items-start gap-2 rounded-lg border-l-4 p-2.5 text-sm", cls)}>
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground">{a.message}</div>
                <div className="text-[11px] text-muted-foreground">{a.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
