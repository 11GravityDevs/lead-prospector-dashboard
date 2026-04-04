function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-bg-elevated ${className ?? ""}`}
    />
  );
}

export default function SettingsLoading() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-9 w-56" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 rounded-lg" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-96 rounded-lg" />
      </div>

      <Skeleton className="h-10 w-24" />
    </div>
  );
}
