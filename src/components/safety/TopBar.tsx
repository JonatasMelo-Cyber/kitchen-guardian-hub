import { AlertTriangle, Bell, ChevronDown, UserCircle2 } from "lucide-react";
import type { SystemStatus } from "@/types/safety";
import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/safety-engine";

const banner: Record<SystemStatus, { cls: string; title: string; sub: string } | null> = {
  normal: null,
  alert: { cls: "bg-status-warning text-status-warning-foreground pulse-warning", title: "ALERTA DETECTADO", sub: "Monitoramento intensivo em andamento" },
  fire: { cls: "bg-status-danger text-status-danger-foreground pulse-danger", title: "INCÊNDIO DETECTADO!", sub: "Ações de contenção em andamento" },
  explosion: { cls: "bg-status-danger text-status-danger-foreground pulse-danger", title: "RISCO DE EXPLOSÃO!", sub: "Vazamento de GLP — não acione interruptores" },
  emergency: { cls: "bg-status-critical text-status-critical-foreground blink-critical", title: "EMERGÊNCIA GERAL", sub: "Protocolos de emergência ativos" },
};

export function TopBar({ status, alertCount }: { status: SystemStatus; alertCount: number }) {
  const b = banner[status];
  const meta = statusMeta(status);
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">DASHBOARD</h1>
        <p className="text-xs text-muted-foreground">Visão geral em tempo real do sistema</p>
      </div>

      <div className="flex-1 lg:max-w-lg lg:mx-6">
        {b ? (
          <div className={cn("flex items-center justify-center gap-3 rounded-2xl px-5 py-3 shadow-lg", b.cls)}>
            <AlertTriangle className="h-5 w-5" />
            <div className="text-center">
              <div className="text-sm font-extrabold tracking-wider">{b.title}</div>
              <div className="text-[11px] opacity-90">{b.sub}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-status-normal/40 bg-status-normal/10 px-5 py-3 text-status-normal">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-status-normal" />
            <div className="text-center">
              <div className="text-sm font-extrabold tracking-wider">SISTEMA NORMAL</div>
              <div className="text-[11px] opacity-90">{meta.message}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <UserCircle2 className="h-5 w-5 text-foreground/80" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold leading-tight">Operador</div>
            <div className="text-[10px] text-muted-foreground">Nível: Administrador</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-status-danger px-1 text-[10px] font-bold text-status-danger-foreground">
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
