import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatSlug } from "@/lib/format";
import type { NicheRow } from "@/lib/queries/dashboard";

export function LeadsByNicheTable({ niches }: { niches: NicheRow[] }) {
  if (niches.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nicho</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Novos</TableHead>
          <TableHead>Contatados</TableHead>
          <TableHead>Ganhos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {niches.map((niche) => (
          <TableRow key={niche.slug}>
            <TableCell className="font-medium">{formatSlug(niche.slug)}</TableCell>
            <TableCell className="tabular-nums">{niche.total}</TableCell>
            <TableCell className="tabular-nums text-status-new">
              {niche.new}
            </TableCell>
            <TableCell className="tabular-nums text-status-contacted">
              {niche.contacted}
            </TableCell>
            <TableCell className="tabular-nums text-status-won">
              {niche.won}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
