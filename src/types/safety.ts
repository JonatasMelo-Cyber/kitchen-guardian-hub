export type SystemStatus = "normal" | "alert" | "fire" | "explosion" | "emergency";

export type SensorState = "ok" | "warning" | "danger";

export type SensorId = "S_calor" | "S_fumaca" | "S_GLP" | "S_movimento";

export interface Sensor {
  id: SensorId;
  label: string;
  unit: string;
  value: number;
  state: SensorState;
  zone: "stove" | "prep" | "vent" | "gas" | "storage";
  position: { x: number; y: number }; // % within plant
}

export type ActuatorId = "ventilacao" | "valvula_gas" | "bomba" | "tomadas";
export type ActuatorState = "on" | "off" | "closed" | "open" | "cut";

export interface Actuator {
  id: ActuatorId;
  label: string;
  state: ActuatorState;
  description: string;
  zone: "stove" | "prep" | "vent" | "gas" | "storage";
  position: { x: number; y: number };
}

export interface AlertMessage {
  id: string;
  level: "info" | "warning" | "danger" | "critical";
  message: string;
  time: string;
}
