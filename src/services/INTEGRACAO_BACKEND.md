# 🔌 INTEGRAÇÃO BACKEND — SafeKitchen

Guia rápido de como conectar este frontend (React + Vite + Tailwind) com o
backend Node.js + SQLite + Socket.IO + Arduino (serial).

## Arquivos-chave do frontend

| Arquivo | Papel |
|---|---|
| `src/services/api.js`            | Cliente REST + lista de endpoints esperados |
| `src/services/socket.js`         | Conexão Socket.IO (tempo real) |
| `src/context/SafetyContext.tsx`  | Estado global do dashboard |
| `src/hooks/useSafetyData.ts`     | Fonte única de dados (hoje mock, amanhã backend) |
| `src/pages/Index.tsx`            | Dashboard — consome o contexto |

## Endpoints REST esperados

| Método | Rota | Uso |
|---|---|---|
| GET  | `/api/sistema/status`         | Snapshot inicial (sensores, atuadores, alertas) |
| POST | `/api/sistema/comando`        | Envia comando ao Arduino via serial |
| POST | `/api/sistema/teste`          | Dispara auto-teste |
| POST | `/api/sistema/emergencia`     | Ativa/desativa modo emergência |
| GET  | `/api/sensores`               | Lista todos os sensores |
| GET  | `/api/sensores/:id/historico` | Série temporal para gráficos |
| GET  | `/api/atuadores`              | Lista todos os atuadores |
| POST | `/api/atuadores/:id/toggle`   | Alterna estado de um atuador |
| GET  | `/api/alertas`                | Histórico de alertas |
| POST | `/api/alertas/limpar`         | Limpa histórico |

## Eventos Socket.IO

**Backend → Frontend:**
- `atualizacao` — snapshot completo (sensores + atuadores + status)
- `sensor:update` — `{ id, value, state }`
- `atuador:update` — `{ id, state }`
- `alerta` — novo alerta
- `emergencia` — `{ ativa }`

**Frontend → Backend → Arduino:**
- `comando` — `{ atuador, acao }`
- `emergencia:toggle` — `{ ativa }`
- `sistema:teste` — `{}`

## Como trocar do mock para o backend real

1. `bun add axios socket.io-client`
2. Defina no `.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_SOCKET_URL=http://localhost:3001
   ```
3. Em `src/services/socket.js`: descomentar `import { io }` e a linha `socket = io(...)`.
4. Em `src/hooks/useSafetyData.ts`: descomentar o bloco "BACKEND" e remover a simulação mock.
5. Pronto — o restante do dashboard continua igual (consome `useSafety()`).

## Fluxo Arduino

```
Arduino (serial) ⇄ Node.js (serialport) ⇄ Socket.IO ⇄ React (useSafetyData)
                                       ⇣
                                     SQLite (histórico)
```
