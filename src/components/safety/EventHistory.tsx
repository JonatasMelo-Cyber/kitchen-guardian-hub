import type { AlertMessage } from "@/types/safety";
import { cn } from "@/lib/utils";

const dot = {
  info: "bg-status-info",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  critical: "bg-status-critical",
} as const;

export function EventHistory({ alerts }: { alerts: AlertMessage[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-wide">HISTÓRICO DE EVENTOS</h2>
          <p className="text-[11px] text-muted-foreground">Últimos eventos do sistema</p>
        </div>
        <button className="text-[11px] font-semibold text-primary hover:underline">Ver todos</button>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 6).map((a) => (
          <div key={a.id} className="flex items-start gap-2 text-xs">
            <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot[a.level])} />
            <span className="font-mono text-[11px] text-muted-foreground">{a.time}</span>
            <span className="flex-1 text-foreground/90">{a.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
