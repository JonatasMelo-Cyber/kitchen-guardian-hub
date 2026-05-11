/* =============================================================================
 * SafeKitchen — API REST Service
 * -----------------------------------------------------------------------------
 * Camada de integração HTTP com o backend Node.js (Express + SQLite).
 *
 * COMO USAR:
 *   import { api, endpoints } from "@/services/api";
 *   const status = await api.get(endpoints.sistema.status);
 *   await api.post(endpoints.sistema.comando, { atuador: "valvula_gas", acao: "fechar" });
 *
 * TROCAR ENTRE MOCK E BACKEND REAL:
 *   - Defina VITE_API_URL no .env para apontar ao backend real
 *   - Enquanto VITE_USE_MOCK=true, o frontend usa dados mockados (ver hooks/useSafetyData)
 * ========================================================================== */

// TODO: instalar axios -> `bun add axios` e substituir o fetch wrapper abaixo
// import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Endpoints esperados do backend Node.js.
 * O backend deverá expor estas rotas (REST) para o dashboard funcionar:
 */
export const endpoints = {
  sistema: {
    status:   "/sistema/status",     // GET  -> { status, sensores, atuadores, alertas }
    comando:  "/sistema/comando",    // POST -> { atuador, acao }   (envia ao Arduino via serial)
    teste:    "/sistema/teste",      // POST -> dispara auto-teste dos sensores
    emergencia: "/sistema/emergencia", // POST -> ativa/desativa modo emergência
  },
  sensores: {
    listar:   "/sensores",           // GET  -> Sensor[]
    porId:    (id) => `/sensores/${id}`, // GET -> Sensor
    historico:(id) => `/sensores/${id}/historico`, // GET -> série temporal
  },
  atuadores: {
    listar:   "/atuadores",          // GET  -> Actuator[]
    toggle:   (id) => `/atuadores/${id}/toggle`, // POST -> alterna estado
  },
  alertas: {
    listar:   "/alertas",            // GET  -> AlertMessage[]
    limpar:   "/alertas/limpar",     // POST -> limpa o histórico
  },
};

// ---------- HTTP wrapper minimalista (substituível por axios) ----------------
async function request(method, path, body) {
  // TODO: trocar para axios quando o backend estiver pronto
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${method} ${path} -> ${res.status}`);
  return res.json();
}

export const api = {
  get:  (path)        => request("GET",  path),
  post: (path, body)  => request("POST", path, body),
  put:  (path, body)  => request("PUT",  path, body),
  del:  (path)        => request("DELETE", path),
};

/* ----------------------------- EXEMPLOS -------------------------------------
// Buscar status geral do sistema:
//   const data = await api.get(endpoints.sistema.status);
//
// Enviar comando para o Arduino (via backend):
//   await api.post(endpoints.sistema.comando, { atuador: "ventilacao", acao: "ligar" });
// -------------------------------------------------------------------------- */
