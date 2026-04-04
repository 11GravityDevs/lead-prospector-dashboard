"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  error: "border-error/30 bg-error-10 text-error",
};

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
};

export function Toast({ message, variant, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = VARIANT_ICON[variant];

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-top-2",
        VARIANT_CLASSES[variant],
      )}
    >
      <Icon size={16} strokeWidth={1.5} />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
