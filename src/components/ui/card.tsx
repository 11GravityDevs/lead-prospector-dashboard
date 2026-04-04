import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-surface border border-border rounded-lg p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
