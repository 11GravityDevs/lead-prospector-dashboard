"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeadDetailModal } from "@/components/lead-detail-modal";
import { formatDate } from "@/lib/format";
import { Star } from "lucide-react";
import type { Lead } from "@/types/database";

interface LeadsTableProps {
  leads: Lead[];
  niches: { slug: string; name: string }[];
}

export function LeadsTable({ leads, niches }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const nicheMap = new Map(niches.map((n) => [n.slug, n.name]));

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Nicho</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Avaliacao</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <TableCell className="font-medium">{lead.company_name}</TableCell>
              <TableCell>
                {nicheMap.get(lead.niche_slug) ?? lead.niche_slug}
              </TableCell>
              <TableCell>
                {lead.phone_whatsapp ?? lead.phone ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant={lead.status} />
              </TableCell>
              <TableCell>
                {lead.rating !== null ? (
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Star className="size-3.5 text-amber-400 fill-amber-400" />
                    {lead.rating}
                    <span className="text-text-secondary">
                      ({lead.review_count ?? 0})
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {lead.personalized_message ?? "—"}
              </TableCell>
              <TableCell className="text-text-secondary tabular-nums whitespace-nowrap">
                {formatDate(lead.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </>
  );
}
