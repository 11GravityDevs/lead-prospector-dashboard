import { createClient } from "@/lib/supabase/server";
import type { DispatchRun } from "@/types/database";

export const ITEMS_PER_PAGE = 20;

export interface DispatchRunsParams {
  page?: number;
}

export interface DispatchRunsResult {
  runs: DispatchRun[];
  total: number;
}

export async function getDispatchRuns(
  params: DispatchRunsParams,
): Promise<DispatchRunsResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, count } = await supabase
    .from("dispatch_runs")
    .select(
      "id, started_at, finished_at, total_sent, total_skipped, total_errors, duration_seconds, niches_processed",
      { count: "exact" },
    )
    .order("finished_at", { ascending: false })
    .range(from, to)
    .overrideTypes<DispatchRun[]>();

  return { runs: data ?? [], total: count ?? 0 };
}
