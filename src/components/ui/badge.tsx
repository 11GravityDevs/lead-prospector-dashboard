import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { LeadStatus, RunStatus } from "@/types/database";

type BadgeVariant = LeadStatus | RunStatus;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant: BadgeVariant;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  new: "text-status-new bg-status-new-10",
  contacted: "text-status-contacted bg-status-contacted-10",
  follow_up: "text-status-follow-up bg-status-follow-up-10",
  won: "text-status-won bg-status-won-10",
  lost: "text-status-lost bg-status-lost-10",
  skipped: "text-status-skipped bg-status-skipped-10",
  running: "text-info bg-info-10",
  completed: "text-status-contacted bg-status-contacted-10",
  failed: "text-error bg-error-10",
};

const LABEL: Record<BadgeVariant, string> = {
  new: "Novo",
  contacted: "Contatado",
  follow_up: "Follow-up",
  won: "Ganho",
  lost: "Perdido",
  skipped: "Ignorado",
  running: "Executando",
  completed: "Concluido",
  failed: "Falhou",
};

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children ?? LABEL[variant]}
    </span>
  );
}
