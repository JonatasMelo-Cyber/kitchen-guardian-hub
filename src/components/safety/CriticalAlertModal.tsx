import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface CriticalAlert {
  id: string;
  title: string;
  message: string;
}

export function CriticalAlertModal({
  alert,
  onClose,
}: {
  alert: CriticalAlert | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!alert) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6"
      aria-live="assertive"
      role="alert"
    >
      {/* Subtle overlay glow — non-blocking */}
      <div className="pointer-events-none absolute inset-0 bg-status-danger/5" />

      <div
        className={cn(
          "pointer-events-auto relative mt-8 w-full max-w-md rounded-2xl border-2 border-status-danger bg-card p-5",
          "animate-[fade-in_0.2s_ease-out] glow-danger pulse-danger",
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-status-danger/15 ring-1 ring-status-danger/40">
            <AlertTriangle className="h-6 w-6 text-status-danger" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-status-danger">Alerta Crítico</div>
            <h3 className="mt-0.5 text-lg font-extrabold leading-tight text-foreground">{alert.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{alert.message}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-background/40 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Reconhecer
          </button>
        </div>
      </div>
    </div>
  );
}
