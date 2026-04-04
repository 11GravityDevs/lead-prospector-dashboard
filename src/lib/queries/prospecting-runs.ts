import { createClient } from "@/lib/supabase/server";
import type { ProspectingRun } from "@/types/database";

export const ITEMS_PER_PAGE = 20;

export interface ProspectingRunsParams {
  niche?: string;
  page?: number;
}

export interface ProspectingRunsResult {
  runs: ProspectingRun[];
  total: number;
}

export async function getProspectingRuns(
  params: ProspectingRunsParams,
): Promise<ProspectingRunsResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("prospecting_runs")
    .select(
      "id, finished_at, niche_slug, city_name, total_processed, total_new, total_errors, duration_seconds, run_status",
      { count: "exact" },
    );

  if (params.niche) {
    query = query.eq("niche_slug", params.niche);
  }

  const { data, count } = await query
    .order("finished_at", { ascending: false })
    .range(from, to)
    .overrideTypes<ProspectingRun[]>();

  return { runs: data ?? [], total: count ?? 0 };
}
