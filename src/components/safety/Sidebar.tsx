import { Flame, LayoutDashboard, Map, Radio, Cpu, CalendarClock, FileBarChart2, Settings, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
];

export function Sidebar({ time, date }: { time: string; date: string }) {
  const [active, setActive] = useState("Dashboard");
  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col bg-sidebar p-5">
      <div className="flex flex-col items-center gap-2 pb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-status-danger/10 ring-1 ring-status-danger/30">
          <Flame className="h-7 w-7 text-status-danger" />
        </div>
        <div className="text-center">
          <div className="text-base font-extrabold tracking-wide text-sidebar-foreground">SAFEKITCHEN</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sistema de Segurança<br/>Cozinha Industrial</div>
        </div>
      </div>

      <div className="flex-1" />

    </aside>
  );
}
