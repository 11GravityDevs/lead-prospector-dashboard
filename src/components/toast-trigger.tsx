"use client";

import { useEffect } from "react";
import { useToast, type ToastVariant } from "@/hooks/use-toast";

interface ToastTriggerProps {
  message: string;
  variant?: ToastVariant;
}

export function ToastTrigger({ message, variant = "error" }: ToastTriggerProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast(message, variant);
  }, [message, variant, toast]);

  return null;
}
