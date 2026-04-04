function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-bg-elevated ${className ?? ""}`} />
  );
}

export default function HomeLoading() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-9 w-48" />

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-48" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      </div>
    </div>
  );
}
