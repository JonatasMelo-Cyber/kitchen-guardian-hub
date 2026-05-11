/* =============================================================================
 * useSafetyData — Fonte única de dados do dashboard
 * -----------------------------------------------------------------------------
 * Hoje: gera dados MOCKADOS (simulação local — mantém o comportamento atual).
 * Amanhã: basta trocar por `useBackendSafetyData` para puxar do Node.js.
 *
 * Como integrar com o backend (passos):
 *   1. GET inicial em /sistema/status                    -> popular estado
 *   2. connectSocket() e ouvir "atualizacao"             -> updates em tempo real
 *   3. toggleActuator -> POST /atuadores/:id/toggle  +   socket.emit("comando", ...)
 * ========================================================================== */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  initialSensors,
  initialActuators,
  evaluateSensorState,
  deriveSystemStatus,
  deriveActuators,
  buildAlerts,
} from "@/lib/safety-engine";
import type { Sensor, SystemStatus, AlertMessage, ActuatorId } from "@/types/safety";
// TODO: descomentar quando integrar com backend
// import { api, endpoints } from "@/services/api";
// import { connectSocket, disconnectSocket } from "@/services/socket";

export interface ChartPoint { t: string; calor: number; fumaca: number; glp: number }

export interface SafetyData {
  sensors: Sensor[];
  actuators: ReturnType<typeof deriveActuators>;
  status: SystemStatus;
  alerts: AlertMessage[];
  series: ChartPoint[];
  manualOverrides: Partial<Record<ActuatorId, boolean>>;
  now: Date;
}

export function useSafetyData() {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [forceStatus, setForceStatus] = useState<SystemStatus | null>(null);
  const [series, setSeries] = useState<ChartPoint[]>([]);
  const [history, setHistory] = useState<AlertMessage[]>([]);
  const [manualOverrides, setManualOverrides] = useState<Partial<Record<ActuatorId, boolean>>>({});
  const [now, setNow] = useState(() => new Date());
  const lastStatus = useRef<SystemStatus>("normal");

  /* -------------------------------------------------------------------------
   * MOCK: simulação local dos sensores (será removida ao plugar o backend).
   * TODO: substituir este bloco por subscrição ao socket "atualizacao".
   * ----------------------------------------------------------------------- */
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      setSensors((prev) =>
        prev.map((s) => {
          const drift = (Math.random() - 0.5) * (s.id === "S_GLP" ? 30 : 4);
          let v = Math.max(0, s.value + drift);
          const baseline = { S_calor: 28, S_fumaca: 4, S_GLP: 80, S_movimento: 0 }[s.id];
          v = v + (baseline - v) * 0.18;
          if (s.id === "S_movimento") v = Math.random() < 0.18 ? 1 : 0;
          v = Math.round(v * 10) / 10;
          return { ...s, value: v, state: evaluateSensorState(s.id, v) };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  /* -------------------------------------------------------------------------
   * BACKEND (exemplo, comentado):
   * -------------------------------------------------------------------------
   * useEffect(() => {
   *   // 1) Snapshot inicial
   *   api.get(endpoints.sistema.status).then((data) => {
   *     setSensors(data.sensores);
   *     // ...etc
   *   });
   *   // 2) Tempo real
   *   const s = connectSocket();
   *   s.on("atualizacao", (snap) => setSensors(snap.sensores));
   *   s.on("sensor:update", ({ id, value, state }) =>
   *     setSensors((prev) => prev.map((x) => x.id === id ? { ...x, value, state } : x))
   *   );
   *   return () => disconnectSocket();
   * }, []);
   * ----------------------------------------------------------------------- */

  // Série temporal para os gráficos
  useEffect(() => {
    const t = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setSeries((prev) => [
      ...prev,
      {
        t,
        calor:  sensors.find((s) => s.id === "S_calor")!.value,
        fumaca: sensors.find((s) => s.id === "S_fumaca")!.value,
        glp:    sensors.find((s) => s.id === "S_GLP")!.value,
      },
    ].slice(-20));
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

  // Log de mudanças de status
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
      lastStatus.current = status;
    }
  }, [status]);

  const alerts = history.length ? history : liveAlerts;

  /* ---------------------------- Ações ---------------------------------- */
  function toggleActuator(id: ActuatorId) {
    const current = actuators.find((a) => a.id === id)!;
    const isOn = current.state === "on" || current.state === "open";
    setManualOverrides((prev) => ({ ...prev, [id]: !isOn }));
    // TODO: backend
    // api.post(endpoints.atuadores.toggle(id), { ativar: !isOn });
    // connectSocket().emit("comando", { atuador: id, acao: !isOn ? "ligar" : "desligar" });
  }

  function triggerEmergency() {
    setForceStatus((prev) => (prev === "emergency" ? null : "emergency"));
    // TODO: api.post(endpoints.sistema.emergencia, { ativa: true });
    //       connectSocket().emit("emergencia:toggle", { ativa: true });
  }

  function testSystem() {
    setHistory((p) => [
      { id: `t-${Date.now()}`, level: "info" as const, message: "Teste de sistema executado: todos sensores OK", time: new Date().toLocaleTimeString("pt-BR") },
      ...p,
    ].slice(0, 12));
    // TODO: api.post(endpoints.sistema.teste);
  }

  function clearAlerts() {
    setHistory([]);
    setManualOverrides({});
    setSensors(initialSensors.map((s) => ({ ...s })));
    // TODO: api.post(endpoints.alertas.limpar);
  }

  return {
    sensors, actuators, status, alerts, series, manualOverrides, now,
    toggleActuator, setForceStatus, triggerEmergency, testSystem, clearAlerts,
  };
}
