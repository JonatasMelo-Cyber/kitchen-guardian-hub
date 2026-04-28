import { useEffect, useMemo, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { KitchenPlant } from "@/components/safety/KitchenPlant";
import { SensorPanel } from "@/components/safety/SensorPanel";
import { ActuatorPanel } from "@/components/safety/ActuatorPanel";
import { AlertsLog } from "@/components/safety/AlertsLog";
import { StatusBanner } from "@/components/safety/StatusBanner";
import { SimulationControls, type SimAction } from "@/components/safety/SimulationControls";
import {
  initialSensors,
  initialActuators,
  evaluateSensorState,
  deriveSystemStatus,
  deriveActuators,
  buildAlerts,
} from "@/lib/safety-engine";
import type { Sensor, SystemStatus } from "@/types/safety";

const Index = () => {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [forceStatus, setForceStatus] = useState<SystemStatus | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [now, setNow] = useState(() => new Date().toLocaleTimeString("pt-BR"));
  const tick = useRef(0);

  // Real-time simulation: gentle drift + occasional spikes in auto mode
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date().toLocaleTimeString("pt-BR"));
      tick.current += 1;
      setSensors((prev) =>
        prev.map((s) => {
          let v = s.value;
          if (autoMode) {
            const drift = (Math.random() - 0.5) * (s.id === "S_GLP" ? 30 : 4);
            v = Math.max(0, v + drift);
            // gravitate back to safe baseline
            const baseline = { S_calor: 28, S_fumaca: 4, S_GLP: 80, S_movimento: 0 }[s.id];
            v = v + (baseline - v) * 0.18;
            if (s.id === "S_movimento") v = Math.random() < 0.15 ? 1 : 0;
          }
          v = Math.round(v * 10) / 10;
          return { ...s, value: v, state: evaluateSensorState(s.id, v) };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, [autoMode]);

  const status: SystemStatus = useMemo(() => forceStatus ?? deriveSystemStatus(sensors), [sensors, forceStatus]);
  const actuators = useMemo(() => deriveActuators(initialActuators, status, sensors), [status, sensors]);
  const alerts = useMemo(() => buildAlerts(sensors, status), [sensors, status]);

  function setSensor(id: Sensor["id"], value: number) {
    setSensors((prev) => prev.map((s) => (s.id === id ? { ...s, value, state: evaluateSensorState(id, value) } : s)));
  }

  function handleAction(a: SimAction) {
    setForceStatus(null);
    switch (a) {
      case "fire":
        setSensor("S_calor", 85);
        setSensor("S_fumaca", 50);
        break;
      case "gas":
        setSensor("S_GLP", 1200);
        break;
      case "smoke":
        setSensor("S_fumaca", 25);
        break;
      case "motion":
        setSensor("S_movimento", 1);
        break;
      case "emergency":
        setForceStatus("emergency");
        break;
      case "reset":
        setSensors(initialSensors.map((s) => ({ ...s })));
        setForceStatus(null);
        break;
      case "toggleAuto":
        setAutoMode((v) => !v);
        break;
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight md:text-2xl">SafeKitchen — Monitoramento de Segurança</h1>
            <p className="text-xs text-muted-foreground">Sistema de supervisão de incêndio, gás e ocupação em cozinhas industriais</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-status-normal" /> {now}
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <StatusBanner status={status} />
          <KitchenPlant sensors={sensors} actuators={actuators} status={status} />
          <div className="grid gap-6 md:grid-cols-2">
            <SensorPanel sensors={sensors} />
            <ActuatorPanel actuators={actuators} />
          </div>
        </section>

        <aside className="space-y-6">
          <SimulationControls onAction={handleAction} autoMode={autoMode} />
          <AlertsLog alerts={alerts} />
        </aside>
      </div>

      <footer className="mx-auto mt-8 max-w-[1600px] text-center text-xs text-muted-foreground">
        SafeKitchen Dashboard · Atualização em tempo real · {new Date().getFullYear()}
      </footer>
    </main>
  );
};

export default Index;
