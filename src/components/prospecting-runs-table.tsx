import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration, formatSlug } from "@/lib/format";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProspectingRun } from "@/types/database";

interface ProspectingRunsTableProps {
  runs: ProspectingRun[];
}

export function ProspectingRunsTable({ runs }: ProspectingRunsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data/Hora</TableHead>
          <TableHead>Nicho</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Processados</TableHead>
          <TableHead>Novos</TableHead>
          <TableHead>Erros</TableHead>
          <TableHead>Duracao</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => {
          const hasError =
            run.total_errors > 0 || run.run_status === "failed";

          return (
            <TableRow
              key={run.id}
              className={cn(hasError && "bg-error-10/50")}
            >
              <TableCell className="text-text-secondary tabular-nums whitespace-nowrap">
                {run.finished_at ? formatDate(run.finished_at) : "—"}
              </TableCell>
              <TableCell>{formatSlug(run.niche_slug)}</TableCell>
              <TableCell>{run.city_name ?? "—"}</TableCell>
              <TableCell className="tabular-nums">
                {run.total_processed}
              </TableCell>
              <TableCell className="tabular-nums">{run.total_new}</TableCell>
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
                <Badge variant={run.run_status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
