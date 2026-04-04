import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatDate, formatDuration, formatSlug } from "@/lib/format";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DispatchRun } from "@/types/database";

interface DispatchRunsTableProps {
  runs: DispatchRun[];
}

export function DispatchRunsTable({ runs }: DispatchRunsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data/Hora</TableHead>
          <TableHead>Enviados</TableHead>
          <TableHead>Ignorados</TableHead>
          <TableHead>Erros</TableHead>
          <TableHead>Duracao</TableHead>
          <TableHead>Nichos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => {
          const hasError = run.total_errors > 0;

          return (
            <TableRow
              key={run.id}
              className={cn(hasError && "bg-error-10/50")}
            >
              <TableCell className="text-text-secondary tabular-nums whitespace-nowrap">
                {run.finished_at ? formatDate(run.finished_at) : "—"}
              </TableCell>
              <TableCell className="tabular-nums">{run.total_sent}</TableCell>
              <TableCell className="tabular-nums">
                {run.total_skipped}
              </TableCell>
              <TableCell className="tabular-nums">
                {hasError ? (
                  <span className="inline-flex items-center gap-1 text-error">
                    <AlertTriangle size={14} strokeWidth={1.5} />
                    {run.total_errors}
                  </span>
                ) : (
                  run.total_errors
                )}
              </TableCell>
              <TableCell className="tabular-nums whitespace-nowrap">
                {run.duration_seconds !== null
                  ? formatDuration(run.duration_seconds)
                  : "—"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {run.niches_processed.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium text-text-secondary bg-bg-elevated"
                    >
                      {formatSlug(niche)}
                    </span>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
