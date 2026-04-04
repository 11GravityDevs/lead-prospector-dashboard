import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon size={48} className="text-text-tertiary mb-4" strokeWidth={1.5} />
      <h2 className="text-[20px] font-semibold leading-7 text-text-primary">
        {title}
      </h2>
      <p className="mt-2 text-sm text-text-secondary max-w-sm">{description}</p>
    </div>
  );
}
