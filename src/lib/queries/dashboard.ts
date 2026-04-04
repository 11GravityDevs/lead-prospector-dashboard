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

type LeadStatusRow = { status: LeadStatus };
type LeadNicheRow = { niche: string; status: LeadStatus };

export async function getKpis(): Promise<Kpis> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("status")
    .overrideTypes<LeadStatusRow[]>();

  const leads = data ?? [];
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    won: leads.filter((l) => l.status === "won").length,
  };
}

export async function getLeadsByNiche(): Promise<NicheRow[]> {
  const supabase = await createClient();

  const [{ data: niches }, { data: leads }] = await Promise.all([
    supabase
      .from("niches")
      .select("slug")
      .eq("active", true)
      .order("sort_order")
      .overrideTypes<{ slug: string }[]>(),
    supabase
      .from("leads")
      .select("niche, status")
      .overrideTypes<LeadNicheRow[]>(),
  ]);

  if (!niches || !leads) return [];

  return niches.map((niche) => {
    const nicheLeads = leads.filter((l) => l.niche === niche.slug);
    return {
      slug: niche.slug,
      total: nicheLeads.length,
      new: nicheLeads.filter((l) => l.status === "new").length,
      contacted: nicheLeads.filter((l) => l.status === "contacted").length,
      won: nicheLeads.filter((l) => l.status === "won").length,
    };
  });
}

export async function getLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("status")
    .overrideTypes<LeadStatusRow[]>();

  const counts: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    follow_up: 0,
    won: 0,
    lost: 0,
    skipped: 0,
  };

  for (const lead of data ?? []) {
    counts[lead.status]++;
  }

  return counts;
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
