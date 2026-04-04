import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/types/database";

export const ITEMS_PER_PAGE = 20;

export interface LeadsParams {
  q?: string;
  niche?: string;
  status?: string;
  page?: number;
}

export interface LeadsResult {
  leads: Lead[];
  total: number;
}

export async function getLeads(params: LeadsParams): Promise<LeadsResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("leads")
    .select(
      "place_id, created_at, company_name, category, phone_gmb, phone_whatsapp, address, niche, status, rating, review_count, website, gmb_link, business_description, business_summary, positive_points, negative_points, general_perception, ai_opportunity, personalized_message",
      { count: "exact" },
    );

  if (params.q) {
    query = query.ilike("company_name", `%${params.q}%`);
  }

  if (params.niche) {
    query = query.eq("niche", params.niche);
  }

  if (params.status) {
    query = query.eq("status", params.status as LeadStatus);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)
    .overrideTypes<Lead[]>();

  return { leads: data ?? [], total: count ?? 0 };
}

export async function getNichesForFilter(): Promise<{ slug: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("niches")
    .select("slug")
    .eq("active", true)
    .order("sort_order")
    .overrideTypes<{ slug: string }[]>();

  return data ?? [];
}
