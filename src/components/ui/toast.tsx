"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ToastData } from "@/hooks/use-toast";

interface ToastItemProps {
  toast: ToastData;
  onDismiss: () => void;
}

const VARIANT_CLASSES = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  error: "border-error/30 bg-error-10 text-error",
} as const;

const VARIANT_ICON = {
  success: CheckCircle,
  error: AlertCircle,
} as const;

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRemoving(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!removing) return;
    const timer = setTimeout(onDismiss, 300);
    return () => clearTimeout(timer);
  }, [removing, onDismiss]);

  const Icon = VARIANT_ICON[toast.variant];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg",
        VARIANT_CLASSES[toast.variant],
      )}
      style={{
        animation: removing
          ? "toast-fade-out 300ms ease-in forwards"
          : "toast-slide-in 300ms ease-out",
      }}
    >
      <Icon size={16} strokeWidth={1.5} />
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => setRemoving(true)}
        className="ml-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
