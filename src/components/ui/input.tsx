import { type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full bg-bg-surface border border-border text-text-primary placeholder:text-text-tertiary rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500-20 focus:border-border-focus transition-colors",
        className,
      )}
      {...props}
    />
  );
}
