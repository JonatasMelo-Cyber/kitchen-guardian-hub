/* =============================================================================
 * SafeKitchen — Socket.IO Service (tempo real)
 * -----------------------------------------------------------------------------
 * Canal em tempo real entre o dashboard e o backend Node.js que conversa
 * com o Arduino via porta serial.
 *
 * EVENTOS ESPERADOS DO BACKEND (server -> client):
 *   "atualizacao"       -> snapshot completo { sensores, atuadores, status }
 *   "sensor:update"     -> { id, value, state }
 *   "atuador:update"    -> { id, state }
 *   "alerta"            -> AlertMessage
 *   "emergencia"        -> { ativa: boolean }
 *
 * EVENTOS ENVIADOS PELO DASHBOARD (client -> server):
 *   "comando"           -> { atuador, acao }     // chega no Arduino
 *   "emergencia:toggle" -> { ativa: boolean }
 *   "sistema:teste"     -> {}
 * ========================================================================== */

// TODO: instalar socket.io-client -> `bun add socket.io-client`
// import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

let socket = null;

/** Inicia (ou reaproveita) a conexão Socket.IO. */
export function connectSocket() {
  if (socket) return socket;

  // TODO: descomentar quando socket.io-client estiver instalado
  // socket = io(SOCKET_URL, { transports: ["websocket"], autoConnect: true });

  // Stub temporário para o frontend não quebrar enquanto o backend não existe:
  socket = createMockSocket();
  return socket;
}

/** Encerra a conexão (use no cleanup de hooks). */
export function disconnectSocket() {
  if (socket?.disconnect) socket.disconnect();
  socket = null;
}

/* ----------------------------- HELPERS --------------------------------------
// Escutar atualizações em tempo real:
//   const s = connectSocket();
//   s.on("atualizacao", (snapshot) => setEstado(snapshot));
//
// Emitir comando para o Arduino:
//   s.emit("comando", { atuador: "valvula_gas", acao: "fechar" });
// -------------------------------------------------------------------------- */

// ---------------------------------------------------------------------------
// Mock socket — simula a interface do socket.io-client enquanto o backend não
// está pronto. Substituir pela linha `io(SOCKET_URL)` acima.
function createMockSocket() {
  const listeners = new Map();
  return {
    on(event, cb)   { (listeners.get(event) ?? listeners.set(event, []).get(event)).push(cb); },
    off(event, cb)  { const l = listeners.get(event); if (l) listeners.set(event, l.filter(f => f !== cb)); },
    emit(event, payload) {
      // TODO: este emit só loga; com backend real vai para o servidor
      // eslint-disable-next-line no-console
      console.debug("[socket-mock] emit", event, payload);
    },
    disconnect() { listeners.clear(); },
    __mock: true,
  };
}
