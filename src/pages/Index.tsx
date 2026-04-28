import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "@/components/safety/Sidebar";
import { TopBar } from "@/components/safety/TopBar";
import { KpiCard } from "@/components/safety/KpiCard";
import { KitchenView } from "@/components/safety/KitchenView";
import { ActuatorGrid } from "@/components/safety/ActuatorGrid";
import { SystemStatusCard } from "@/components/safety/SystemStatusCard";
import { EventHistory } from "@/components/safety/EventHistory";
import { RealtimeCharts } from "@/components/safety/RealtimeCharts";
import { QuickControls } from "@/components/safety/QuickControls";
import {
  initialSensors,
  initialActuators,
  evaluateSensorState,
  deriveSystemStatus,
  deriveActuators,
  buildAlerts,
} from "@/lib/safety-engine";
import type { Sensor, SystemStatus, AlertMessage } from "@/types/safety";

interface ChartPoint { t: string; calor: number; fumaca: number; glp: number }

const Index = () => {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [forceStatus, setForceStatus] = useState<SystemStatus | null>(null);
  const [autoMode] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [series, setSeries] = useState<ChartPoint[]>([]);
  const [history, setHistory] = useState<AlertMessage[]>([]);
  const lastStatus = useRef<SystemStatus>("normal");

  // Real-time tick
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      setSensors((prev) =>
        prev.map((s) => {
          let v = s.value;
          if (autoMode) {
            const drift = (Math.random() - 0.5) * (s.id === "S_GLP" ? 30 : 4);
            v = Math.max(0, v + drift);
            const baseline = { S_calor: 28, S_fumaca: 4, S_GLP: 80, S_movimento: 0 }[s.id];
            v = v + (baseline - v) * 0.18;
            if (s.id === "S_movimento") v = Math.random() < 0.18 ? 1 : 0;
          }
          v = Math.round(v * 10) / 10;
          return { ...s, value: v, state: evaluateSensorState(s.id, v) };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, [autoMode]);

  // Chart series
  useEffect(() => {
    const t = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setSeries((prev) => {
      const next = [
        ...prev,
        {
          t,
          calor: sensors.find((s) => s.id === "S_calor")!.value,
          fumaca: sensors.find((s) => s.id === "S_fumaca")!.value,
          glp: sensors.find((s) => s.id === "S_GLP")!.value,
        },
      ];
      return next.slice(-20);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const status: SystemStatus = useMemo(
    () => forceStatus ?? deriveSystemStatus(sensors),
    [sensors, forceStatus],
  );
  const actuators = useMemo(() => deriveActuators(initialActuators, status, sensors), [status, sensors]);
  const liveAlerts = useMemo(() => buildAlerts(sensors, status), [sensors, status]);

  // Append events on status change
  useEffect(() => {
    if (status !== lastStatus.current) {
      const t = new Date().toLocaleTimeString("pt-BR");
      const map: Record<SystemStatus, AlertMessage> = {
        normal: { id: `n-${Date.now()}`, level: "info", message: "Sistema retornou ao estado normal", time: t },
        alert: { id: `a-${Date.now()}`, level: "warning", message: "Alerta: leitura anormal detectada", time: t },
        fire: { id: `f-${Date.now()}`, level: "critical", message: "Incêndio detectado na área de cozimento", time: t },
        explosion: { id: `e-${Date.now()}`, level: "critical", message: "Vazamento de GLP — risco de explosão", time: t },
        emergency: { id: `em-${Date.now()}`, level: "critical", message: "Emergência manual ativada pelo operador", time: t },
      };
      setHistory((prev) => [map[status], ...prev].slice(0, 12));
      lastStatus.current = status;
    }
  }, [status]);

  const alerts = history.length ? history : liveAlerts;

  function setSensor(id: Sensor["id"], value: number) {
    setSensors((prev) => prev.map((s) => (s.id === id ? { ...s, value, state: evaluateSensorState(id, value) } : s)));
  }

  function handleAction(a: string) {
    setForceStatus(null);
    switch (a) {
      case "fire": setSensor("S_calor", 85); setSensor("S_fumaca", 50); break;
      case "gas": setSensor("S_GLP", 1200); break;
      case "emergency": setForceStatus("emergency"); break;
      case "test":
        setHistory((p) => [{ id: `t-${Date.now()}`, level: "info", message: "Teste de sistema executado: todos sensores OK", time: new Date().toLocaleTimeString("pt-BR") }, ...p].slice(0, 12));
        break;
      case "clear":
        setHistory([]);
        setSensors(initialSensors.map((s) => ({ ...s })));
        break;
    }
  }

  const time = now.toLocaleTimeString("pt-BR", { hour12: false });
  const date = now.toLocaleDateString("pt-BR");
  const alertCount = alerts.filter((a) => a.level === "danger" || a.level === "critical" || a.level === "warning").length;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar time={time} date={date} />
      <main className="flex-1 space-y-5 p-5 lg:p-6 overflow-x-hidden">
        <TopBar status={status} alertCount={alertCount} />

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {sensors.map((s) => <KpiCard key={s.id} sensor={s} />)}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <KitchenView sensors={sensors} status={status} />
          <div className="space-y-5">
            <ActuatorGrid actuators={actuators} />
            <SystemStatusCard status={status} sensors={sensors} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <EventHistory alerts={alerts} />
          <RealtimeCharts data={series} />
          <QuickControls onAction={handleAction} />
        </section>
      </main>
    </div>
  );
};

export default Index;
