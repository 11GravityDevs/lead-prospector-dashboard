"use client";

import { type HTMLAttributes, type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-bg-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto bg-bg-surface border border-border rounded-lg shadow-md p-6">
        {children}
      </div>
    </div>,
    document.body,
  );
}

type ModalHeaderProps = {
  children: ReactNode;
  onClose: () => void;
};

export function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{children}</h2>
      <button
        onClick={onClose}
        className="text-text-tertiary hover:text-text-primary transition-colors"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

export function ModalBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}
