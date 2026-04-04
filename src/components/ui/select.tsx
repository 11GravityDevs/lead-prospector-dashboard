"use client";

import { type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none bg-bg-surface border border-border text-text-primary rounded-md px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-green-500-20 focus:border-border-focus transition-colors",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
    </div>
  );
}
