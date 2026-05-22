import { AlertTriangle } from "lucide-react";
import type { SystemStatus } from "@/types/safety";
import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/safety-engine";
import { HelpModal } from "./HelpModal";

const banner: Record<SystemStatus, { cls: string; title: string; sub: string } | null> = {
  normal: null,
  alert:    { cls: "border-status-warning/60 bg-status-warning/10 text-status-warning glow-warning", title: "ALERTA DETECTADO", sub: "Monitoramento intensivo em andamento" },
  fire:     { cls: "border-status-danger/70 bg-status-danger/10 text-status-danger glow-danger pulse-danger", title: "INCÊNDIO DETECTADO", sub: "Acionando supressão" },
  explosion:{ cls: "border-status-danger/70 bg-status-danger/10 text-status-danger glow-danger pulse-danger", title: "RISCO DE EXPLOSÃO", sub: "Vazamento de GLP" },
  emergency:{ cls: "border-status-critical/70 bg-status-critical/15 text-status-critical glow-danger blink-critical", title: "EMERGÊNCIA GERAL", sub: "Protocolos de emergência ativos" },
};

export function TopBar({ status, alertCount, time, date }: { status: SystemStatus; alertCount: number; time: string; date: string }) {
  const b = banner[status];
  const meta = statusMeta(status);
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        {b ? (
          <div className={cn("flex items-center gap-3 rounded-2xl border-2 px-5 py-3", b.cls)}>
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-extrabold tracking-wider truncate">{b.title}</div>
              <div className="text-[11px] opacity-90 truncate">{b.sub}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-status-normal/40 bg-status-normal/10 px-5 py-3 text-status-normal glow-normal">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-status-normal" />
            <div className="min-w-0">
              <div className="text-sm font-extrabold tracking-wider">SISTEMA NORMAL</div>
              <div className="text-[11px] opacity-90 truncate">{meta.message}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="rounded-xl border border-border bg-card px-3 py-2 text-right">
          <div className="font-mono text-sm font-bold text-foreground tabular-nums leading-none">{time}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{date}</div>
        </div>
      </div>
    </header>
  );
}
