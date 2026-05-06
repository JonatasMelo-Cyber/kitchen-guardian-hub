import { AlertTriangle, Siren, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type ToastLevel = "warning" | "danger";

export interface AlertToast {
  id: string;
  level: ToastLevel;
  title?: string;
  message: string;
}

export function AlertToasts({
  toasts,
  onDismiss,
}: {
  toasts: AlertToast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: AlertToast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  const isDanger = toast.level === "danger";
  const Icon = isDanger ? Siren : AlertTriangle;

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border-2 p-3 shadow-2xl backdrop-blur-sm",
        "animate-[slide-in-right_0.25s_ease-out,fade-in_0.25s_ease-out]",
        isDanger
          ? "border-status-danger/70 bg-status-danger text-status-danger-foreground glow-danger pulse-danger"
          : "border-status-warning/70 bg-status-warning text-status-warning-foreground glow-warning",
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/20 ring-1 ring-white/30">
        <Icon className={cn("h-5 w-5", isDanger && "blink-critical")} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold uppercase tracking-widest">
          {isDanger ? "Perigo Imediato" : "Alerta Detectado"}
        </div>
        {toast.title && <div className="text-sm font-bold leading-tight">{toast.title}</div>}
        <div className="mt-0.5 text-[11px] font-medium opacity-95">{toast.message}</div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar"
        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/20"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
