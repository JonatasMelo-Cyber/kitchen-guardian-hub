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
import { EmergencyButton } from "@/components/safety/EmergencyButton";
import { ManualControls } from "@/components/safety/ManualControls";
import { CriticalAlertModal, type CriticalAlert } from "@/components/safety/CriticalAlertModal";
import {
  initialSensors,
  initialActuators,
  evaluateSensorState,
  deriveSystemStatus,
  deriveActuators,
  buildAlerts,
} from "@/lib/safety-engine";
import type { Sensor, SystemStatus, AlertMessage, ActuatorId, Actuator } from "@/types/safety";

interface ChartPoint { t: string; calor: number; fumaca: number; glp: number }

const Index = () => {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [forceStatus, setForceStatus] = useState<SystemStatus | null>(null);
  const [autoMode] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [series, setSeries] = useState<ChartPoint[]>([]);
  const [history, setHistory] = useState<AlertMessage[]>([]);
  const [manualOverrides, setManualOverrides] = useState<Partial<Record<ActuatorId, boolean>>>({});
  const [criticalAlert, setCriticalAlert] = useState<CriticalAlert | null>(null);
  const dismissedAlerts = useRef<Set<string>>(new Set());
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
  const actuators = useMemo(
    () => deriveActuators(initialActuators, status, sensors, manualOverrides),
    [status, sensors, manualOverrides],
  );
  const liveAlerts = useMemo(() => buildAlerts(sensors, status), [sensors, status]);

  // Status-change events log + critical popup
  useEffect(() => {
    if (status !== lastStatus.current) {
      const t = new Date().toLocaleTimeString("pt-BR");
      const map: Record<SystemStatus, AlertMessage> = {
        normal:    { id: `n-${Date.now()}`,  level: "info",     message: "Sistema retornou ao estado normal", time: t },
        alert:     { id: `a-${Date.now()}`,  level: "warning",  message: "Alerta: leitura anormal detectada", time: t },
        fire:      { id: `f-${Date.now()}`,  level: "critical", message: "Incêndio detectado na área de cozimento", time: t },
        explosion: { id: `e-${Date.now()}`,  level: "critical", message: "Vazamento de GLP — risco de explosão", time: t },
        emergency: { id: `em-${Date.now()}`, level: "critical", message: "Emergência manual ativada pelo operador", time: t },
      };
      setHistory((prev) => [map[status], ...prev].slice(0, 12));

      // Trigger popup on entering a critical state
      if (status === "fire") {
        setCriticalAlert({ id: "fire", title: "Incêndio detectado", message: "Calor e fumaça em níveis críticos. Sistema acionou supressão automaticamente." });
      } else if (status === "explosion") {
        setCriticalAlert({ id: "explosion", title: "Nível de gás crítico", message: "Concentração de GLP acima do limite. Válvula fechada automaticamente. Não acione interruptores." });
      } else if (status === "emergency") {
        setCriticalAlert({ id: "emergency", title: "Emergência geral ativada", message: "Todos os protocolos de segurança foram acionados." });
      }
      lastStatus.current = status;
    }
  }, [status]);

  // Per-sensor critical detection (gas, heat, smoke) — independent of system status
  useEffect(() => {
    const glp = sensors.find((s) => s.id === "S_GLP")!;
    if (glp.state === "danger" && !dismissedAlerts.current.has("glp")) {
      setCriticalAlert({
        id: "glp",
        title: "Nível de gás crítico detectado",
        message: `Concentração de GLP em ${Math.round(glp.value)} ppm. Acione protocolos de segurança imediatamente.`,
      });
      dismissedAlerts.current.add("glp");
    }
    if (glp.state === "ok") dismissedAlerts.current.delete("glp");
  }, [sensors]);

  const alerts = history.length ? history : liveAlerts;

  function setSensor(id: Sensor["id"], value: number) {
    setSensors((prev) => prev.map((s) => (s.id === id ? { ...s, value, state: evaluateSensorState(id, value) } : s)));
  }

  function handleAction(a: string) {
    setForceStatus(null);
    switch (a) {
      case "fire":      setSensor("S_calor", 85); setSensor("S_fumaca", 50); break;
      case "gas":       setSensor("S_GLP", 1200); break;
      case "smoke":     setSensor("S_fumaca", 50); break;
      case "motion":    setSensor("S_movimento", 1); break;
      case "emergency": setForceStatus("emergency"); break;
      case "test":
        setHistory((p) => [{ id: `t-${Date.now()}`, level: "info" as const, message: "Teste de sistema executado: todos sensores OK", time: new Date().toLocaleTimeString("pt-BR") }, ...p].slice(0, 12));
        break;
      case "clear":
        setHistory([]);
        setManualOverrides({});
        dismissedAlerts.current.clear();
        setCriticalAlert(null);
        setSensors(initialSensors.map((s) => ({ ...s })));
        break;
    }
  }

  function handleToggleActuator(id: ActuatorId) {
    const current = actuators.find((a) => a.id === id)!;
    const isOn = current.state === "on" || current.state === "open";
    setManualOverrides((prev) => ({ ...prev, [id]: !isOn }));
  }

  const time = now.toLocaleTimeString("pt-BR", { hour12: false });
  const date = now.toLocaleDateString("pt-BR");
  const alertCount = alerts.filter((a) => a.level === "danger" || a.level === "critical" || a.level === "warning").length;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar time={time} date={date} status={status} sensorsOnline={sensors.length} totalSensors={sensors.length} />
      <main className="flex-1 space-y-4 p-4 lg:p-6 overflow-x-hidden">
        <TopBar status={status} alertCount={alertCount} time={time} date={date} />

        {/* Manual quick controls — replaces former search bar */}
        <ManualControls
          actuators={actuators}
          manualOverrides={manualOverrides}
          onToggle={handleToggleActuator}
        />

        {/* KPI sensors with dynamic borders */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {sensors.map((s) => <KpiCard key={s.id} sensor={s} />)}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <KitchenView sensors={sensors} status={status} />
            <div className="grid gap-4 md:grid-cols-2">
              <EventHistory alerts={alerts} />
              <RealtimeCharts data={series} />
            </div>
          </div>
          <div className="space-y-4">
            {/* Emergency above actuators, with prominence */}
            <EmergencyButton onClick={() => handleAction("emergency")} active={status === "emergency"} />
            <ActuatorGrid actuators={actuators} manualOverrides={manualOverrides} onToggle={handleToggleActuator} />
            <SystemStatusCard status={status} sensors={sensors} />
          </div>
        </section>

        <section>
          <QuickControls onAction={handleAction} />
        </section>
      </main>

      <CriticalAlertModal alert={criticalAlert} onClose={() => setCriticalAlert(null)} />
    </div>
  );
};

export default Index;
