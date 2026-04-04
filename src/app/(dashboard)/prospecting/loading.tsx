function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-bg-elevated ${className ?? ""}`}
    />
  );
}

export default function ProspectingLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />

      <Skeleton className="h-10 w-48" />

      <Skeleton className="h-[500px]" />

      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
