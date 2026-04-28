import { Flame, LayoutDashboard, Map, Radio, Cpu, CalendarClock, FileBarChart2, Settings, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Map, label: "Planta" },
  { icon: Radio, label: "Sensores" },
  { icon: Cpu, label: "Atuadores" },
  { icon: CalendarClock, label: "Eventos" },
  { icon: FileBarChart2, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
];

export function Sidebar({ time, date }: { time: string; date: string }) {
  const [active, setActive] = useState("Dashboard");
  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5">
      <div className="flex flex-col items-center gap-2 pb-6 border-b border-sidebar-border">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-status-danger/10 ring-1 ring-status-danger/30">
          <Flame className="h-7 w-7 text-status-danger" />
        </div>
        <div className="text-center">
          <div className="text-base font-extrabold tracking-wide text-sidebar-foreground">SAFEKITCHEN</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sistema de Segurança<br/>Cozinha Industrial</div>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-1">
        {items.map(({ icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-status-normal">
          <CircleDot className="h-3 w-3 animate-pulse" /> CONECTADO
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Sistema online</div>
      </div>
      <div className="mt-3 rounded-xl border border-sidebar-border bg-background/40 p-3 text-center">
        <div className="font-mono text-xl font-bold text-foreground tabular-nums">{time}</div>
        <div className="text-[11px] text-muted-foreground">{date}</div>
      </div>
    </aside>
  );
}
