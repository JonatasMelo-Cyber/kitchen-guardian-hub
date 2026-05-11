/* =============================================================================
 * Dashboard SafeKitchen
 * -----------------------------------------------------------------------------
 * Esta página consome `useSafety()` (SafetyContext) — a fonte ÚNICA de dados.
 * Hoje os dados vêm de um mock local; ao ligar o backend Node.js basta trocar
 * a implementação dentro de `src/hooks/useSafetyData.ts` (ver INTEGRACAO_BACKEND.md).
 *
 * Mapeamento Componente → Origem dos dados (futuro backend):
 *   KpiCard         <- GET /api/sensores         + socket "sensor:update"
 *   ActuatorGrid    <- GET /api/atuadores        + socket "atuador:update"
 *   ManualControls  -> POST /api/atuadores/:id/toggle (emit "comando")
 *   EmergencyButton -> POST /api/sistema/emergencia   (emit "emergencia:toggle")
 *   EventHistory    <- GET /api/alertas          + socket "alerta"
 *   RealtimeCharts  <- GET /api/sensores/:id/historico  (ou socket "atualizacao")
 *   QuickControls   -> POST /api/sistema/teste | /api/alertas/limpar
 * ========================================================================== */
import { useEffect, useRef, useState } from "react";
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
import { SafetyProvider, useSafety } from "@/context/SafetyContext";
import type { SystemStatus } from "@/types/safety";

function Dashboard() {
  // ------------------------------------------------------------------
  // Estado global (mock hoje, backend amanhã — ver useSafetyData.ts)
  // TODO: ao plugar o backend, este hook já estará servindo dados reais
  // ------------------------------------------------------------------
  const {
    sensors, actuators, status, alerts, series, manualOverrides,
    toggleActuator, triggerEmergency, testSystem, clearAlerts, setForceStatus,
  } = useSafety();

  const [criticalAlert, setCriticalAlert] = useState<CriticalAlert | null>(null);
  const [now, setNow] = useState(() => new Date());
  const lastStatus = useRef<SystemStatus>("normal");
  const dismissedAlerts = useRef<Set<string>>(new Set());

  // Relógio do header (puramente visual)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // TODO: escutar evento socket "alerta" para abrir o popup crítico vindo do backend
  useEffect(() => {
    if (status !== lastStatus.current) {
      if (status === "fire")      setCriticalAlert({ id: "fire", title: "Incêndio detectado", message: "Calor e fumaça em níveis críticos. Sistema acionou supressão automaticamente." });
      else if (status === "explosion") setCriticalAlert({ id: "explosion", title: "Nível de gás crítico", message: "Concentração de GLP acima do limite. Válvula fechada automaticamente." });
      else if (status === "emergency") setCriticalAlert({ id: "emergency", title: "Emergência geral ativada", message: "Todos os protocolos de segurança foram acionados." });
      lastStatus.current = status;
    }
  }, [status]);

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

  // Atalhos do QuickControls (botões manuais de simulação/emergência)
  function handleAction(a: string) {
    switch (a) {
      // TODO: substituir simulação por POST /api/sistema/comando quando houver backend
      case "fire":      setForceStatus("fire"); break;
      case "gas":       setForceStatus("explosion"); break;
      case "smoke":     setForceStatus("alert"); break;
      case "emergency": triggerEmergency(); break;
      case "test":      testSystem(); break;
      case "clear":
        clearAlerts();
        dismissedAlerts.current.clear();
        setCriticalAlert(null);
        setForceStatus(null);
        break;
    }
  }

  const time = now.toLocaleTimeString("pt-BR", { hour12: false });
  const date = now.toLocaleDateString("pt-BR");
  const alertCount = alerts.filter((a) => a.level === "danger" || a.level === "critical" || a.level === "warning").length;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar time={time} date={date} status={status} sensorsOnline={sensors.length} totalSensors={sensors.length} />
      <main className="flex-1 space-y-4 p-4 lg:p-6 overflow-x-hidden">
        <TopBar status={status} alertCount={alertCount} time={time} date={date} />

        {/* Controles manuais — TODO: emit socket "comando" no toggle */}
        <ManualControls
          actuators={actuators}
          manualOverrides={manualOverrides}
          onToggle={toggleActuator}
        />

        {/* KPIs — cada card representa um sensor (S_calor, S_fumaca, S_GLP, S_movimento)
            TODO: dado vem de socket "sensor:update" / GET /api/sensores */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {sensors.map((s) => <KpiCard key={s.id} sensor={s} />)}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <KitchenView sensors={sensors} status={status} />
            <div className="grid gap-4 md:grid-cols-2">
              {/* TODO: histórico vem de GET /api/alertas + socket "alerta" */}
              <EventHistory alerts={alerts} />
              {/* TODO: série temporal vem de GET /api/sensores/:id/historico */}
              <RealtimeCharts data={series} />
            </div>
          </div>
          <div className="space-y-4">
            {/* TODO: POST /api/sistema/emergencia */}
            <EmergencyButton onClick={() => handleAction("emergency")} active={status === "emergency"} />
            {/* TODO: estado vem de socket "atuador:update" */}
            <ActuatorGrid actuators={actuators} manualOverrides={manualOverrides} onToggle={toggleActuator} />
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
}

const Index = () => (
  <SafetyProvider>
    <Dashboard />
  </SafetyProvider>
);

export default Index;
