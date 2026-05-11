/* =============================================================================
 * SafetyContext — Estado global do dashboard
 * -----------------------------------------------------------------------------
 * Centraliza sensores, atuadores, alertas e status do sistema.
 *
 * MODO ATUAL: mock (dados simulados localmente).
 * MODO BACKEND: trocar `useMockSafetyData` por `useBackendSafetyData`
 *               (REST + Socket.IO) — ver src/hooks/useSafetyData.ts
 * ========================================================================== */
import { createContext, useContext, type ReactNode } from "react";
import { useSafetyData, type SafetyData } from "@/hooks/useSafetyData";
import type { ActuatorId, SystemStatus } from "@/types/safety";

interface SafetyContextValue extends SafetyData {
  toggleActuator: (id: ActuatorId) => void;
  setForceStatus: (s: SystemStatus | null) => void;
  triggerEmergency: () => void;
  testSystem: () => void;
  clearAlerts: () => void;
}

const SafetyContext = createContext<SafetyContextValue | null>(null);

export function SafetyProvider({ children }: { children: ReactNode }) {
  // TODO: quando o backend estiver disponível, trocar para useBackendSafetyData()
  const value = useSafetyData();
  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error("useSafety deve ser usado dentro de <SafetyProvider>");
  return ctx;
}
