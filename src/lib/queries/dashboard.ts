import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, RunStatus } from "@/types/database";

export interface Kpis {
  total: number;
  new: number;
  contacted: number;
  won: number;
}

export interface NicheRow {
  slug: string;
  total: number;
  new: number;
  contacted: number;
  won: number;
}

async function countLeads(filters: { status?: LeadStatus; niche?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.niche) query = query.eq("niche", filters.niche);

  const { count } = await query;
  return count ?? 0;
}

export async function getKpis(): Promise<Kpis> {
  const [total, newCount, contacted, won] = await Promise.all([
    countLeads({}),
    countLeads({ status: "new" }),
    countLeads({ status: "contacted" }),
    countLeads({ status: "won" }),
  ]);

  return { total, new: newCount, contacted, won };
}

export async function getLeadsByNiche(): Promise<NicheRow[]> {
  const supabase = await createClient();

  const { data: niches } = await supabase
    .from("niches")
    .select("slug")
    .eq("active", true)
    .order("sort_order")
    .overrideTypes<{ slug: string }[]>();

  if (!niches) return [];

  return Promise.all(
    niches.map(async (niche) => {
      const [total, newCount, contacted, won] = await Promise.all([
        countLeads({ niche: niche.slug }),
        countLeads({ niche: niche.slug, status: "new" }),
        countLeads({ niche: niche.slug, status: "contacted" }),
        countLeads({ niche: niche.slug, status: "won" }),
      ]);

      return {
        slug: niche.slug,
        total,
        new: newCount,
        contacted,
        won,
      };
    })
  );
}

export async function getLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const statuses: LeadStatus[] = [
    "new",
    "contacted",
    "follow_up",
    "won",
    "lost",
    "skipped",
  ];

  const results = await Promise.all(
    statuses.map((status) => countLeads({ status }))
  );

  return statuses.reduce(
    (acc, status, i) => {
      acc[status] = results[i];
      return acc;
    },
    {
      new: 0,
      contacted: 0,
      follow_up: 0,
      won: 0,
      lost: 0,
      skipped: 0,
    } as Record<LeadStatus, number>
  );
}

export async function getLatestProspectingRun() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prospecting_runs")
    .select("finished_at, niche_slug, city_name, total_new, run_status")
    .order("finished_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .overrideTypes<{
      finished_at: string | null;
      niche_slug: string;
      city_name: string | null;
      total_new: number;
      run_status: RunStatus;
    }>();

  return data;
}

export async function getLatestDispatchRun() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dispatch_runs")
    .select("finished_at, total_sent, total_errors")
    .order("finished_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .overrideTypes<{
      finished_at: string | null;
      total_sent: number;
      total_errors: number;
    }>();

  return data;
}
