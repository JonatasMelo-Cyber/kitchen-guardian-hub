import type { Sensor, Actuator, SystemStatus, AlertMessage, SensorState } from "@/types/safety";

export const initialSensors: Sensor[] = [
  { id: "S_calor", label: "Sensor de Calor", unit: "°C", value: 28, state: "ok", zone: "stove", position: { x: 32, y: 46 } },
  { id: "S_fumaca", label: "Sensor de Fumaça", unit: "%", value: 4, state: "ok", zone: "vent", position: { x: 28, y: 22 } },
  { id: "S_GLP", label: "Sensor de GLP", unit: "ppm", value: 80, state: "ok", zone: "gas", position: { x: 88, y: 70 } },
  { id: "S_movimento", label: "Sensor de Movimento", unit: "", value: 0, state: "ok", zone: "prep", position: { x: 55, y: 70 } },
];

export const initialActuators: Actuator[] = [
  { id: "ventilacao", label: "Ventilação / Exaustor", state: "off", description: "Coifa motorizada", zone: "vent", position: { x: 22, y: 8 } },
  { id: "valvula_gas", label: "Válvula de Gás", state: "open", description: "Solenoide GLP", zone: "gas", position: { x: 88, y: 78 } },
  { id: "bomba", label: "Bomba de Combate", state: "off", description: "Sprinkler / supressão", zone: "stove", position: { x: 10, y: 28 } },
  { id: "tomadas", label: "Tomadas Elétricas", state: "on", description: "Circuito da cozinha", zone: "prep", position: { x: 70, y: 18 } },
];

export function evaluateSensorState(id: Sensor["id"], value: number): SensorState {
  switch (id) {
    case "S_calor":
      if (value >= 70) return "danger";
      if (value >= 50) return "warning";
      return "ok";
    case "S_fumaca":
      if (value >= 40) return "danger";
      if (value >= 15) return "warning";
      return "ok";
    case "S_GLP":
      if (value >= 1000) return "danger";
      if (value >= 400) return "warning";
      return "ok";
    case "S_movimento":
      return value > 0 ? "warning" : "ok";
  }
}

export function deriveSystemStatus(sensors: Sensor[]): SystemStatus {
  const calor = sensors.find((s) => s.id === "S_calor")!;
  const fumaca = sensors.find((s) => s.id === "S_fumaca")!;
  const glp = sensors.find((s) => s.id === "S_GLP")!;

  if (glp.state === "danger" && (calor.state !== "ok" || fumaca.state !== "ok")) return "explosion";
  if (calor.state === "danger" && fumaca.state === "danger") return "fire";
  if (glp.state === "danger") return "explosion";
  if (calor.state === "danger" || fumaca.state === "danger") return "fire";
  if (sensors.some((s) => s.state === "warning")) return "alert";
  return "normal";
}

export function deriveActuators(prev: Actuator[], status: SystemStatus, sensors: Sensor[]): Actuator[] {
  const fumaca = sensors.find((s) => s.id === "S_fumaca")!;
  const glp = sensors.find((s) => s.id === "S_GLP")!;
  const calor = sensors.find((s) => s.id === "S_calor")!;

  return prev.map((a) => {
    switch (a.id) {
      case "ventilacao":
        return { ...a, state: fumaca.state !== "ok" || glp.state !== "ok" || status !== "normal" ? "on" : "off" };
      case "valvula_gas":
        return { ...a, state: glp.state !== "ok" || status === "explosion" || status === "fire" || status === "emergency" ? "closed" : "open" };
      case "bomba":
        return { ...a, state: status === "fire" || calor.state === "danger" ? "on" : "off" };
      case "tomadas":
        return { ...a, state: status === "fire" || status === "explosion" || status === "emergency" ? "cut" : "on" };
    }
  });
}

export function statusMeta(status: SystemStatus) {
  switch (status) {
    case "normal":
      return { label: "Sistema Normal", color: "status-normal", message: "Todos os sensores operando dentro dos limites seguros." };
    case "alert":
      return { label: "Alerta", color: "status-warning", message: "Leitura anormal detectada. Monitoramento ativo." };
    case "fire":
      return { label: "Incêndio Detectado", color: "status-danger", message: "Calor e fumaça acima do limite. Acionando supressão e cortando energia." };
    case "explosion":
      return { label: "Risco de Explosão", color: "status-danger", message: "Concentração crítica de GLP. Válvula fechada e ventilação máxima." };
    case "emergency":
      return { label: "Emergência Geral", color: "status-critical", message: "Modo de emergência manual ativado. Brigada acionada." };
  }
}

export function buildAlerts(sensors: Sensor[], status: SystemStatus): AlertMessage[] {
  const out: AlertMessage[] = [];
  const t = new Date().toLocaleTimeString("pt-BR");
  for (const s of sensors) {
    if (s.state === "danger") {
      out.push({ id: `${s.id}-d`, level: "critical", message: `${s.label} em nível CRÍTICO (${s.value}${s.unit}).`, time: t });
    } else if (s.state === "warning") {
      out.push({ id: `${s.id}-w`, level: "warning", message: `${s.label} acima do normal (${s.value}${s.unit}).`, time: t });
    }
  }
  if (status === "fire") out.push({ id: "sys-fire", level: "critical", message: "INCÊNDIO: evacue a área e aguarde a brigada.", time: t });
  if (status === "explosion") out.push({ id: "sys-exp", level: "critical", message: "RISCO DE EXPLOSÃO: não acione interruptores!", time: t });
  if (status === "emergency") out.push({ id: "sys-em", level: "critical", message: "Emergência manual ativada pelo operador.", time: t });
  if (out.length === 0) out.push({ id: "ok", level: "info", message: "Sem ocorrências. Cozinha segura.", time: t });
  return out;
}
