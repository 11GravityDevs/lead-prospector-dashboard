"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastContext, type ToastData, type ToastVariant } from "@/hooks/use-toast";
import { ToastItem } from "@/components/ui/toast";

const MAX_VISIBLE = 3;

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "error") => {
      const id = nextId++;
      setToasts((prev) => [
        ...prev.slice(-(MAX_VISIBLE - 1)),
        { id, message, variant },
      ]);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="fixed top-4 right-4 z-50 flex flex-col gap-3"
            aria-live="polite"
          >
            {toasts.map((t) => (
              <ToastItem
                key={t.id}
                toast={t}
                onDismiss={() => dismiss(t.id)}
              />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext>
  );
}
