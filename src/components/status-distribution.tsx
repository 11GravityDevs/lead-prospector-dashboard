import type { LeadStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";

const STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "follow_up",
  "won",
  "lost",
  "skipped",
];

const BAR_COLORS: Record<LeadStatus, string> = {
  new: "bg-status-new",
  contacted: "bg-status-contacted",
  follow_up: "bg-status-follow-up",
  won: "bg-status-won",
  lost: "bg-status-lost",
  skipped: "bg-status-skipped",
};

export function StatusDistribution({
  counts,
}: {
  counts: Record<LeadStatus, number>;
}) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      <div className="h-3 w-full rounded-sm overflow-hidden flex bg-bg-elevated">
        {total > 0 &&
          STATUS_ORDER.map((status) => {
            const pct = (counts[status] / total) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={status}
                className={`${BAR_COLORS[status]} h-full`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <Badge variant={status} />
            <span className="text-xs text-text-secondary tabular-nums">
              {counts[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
