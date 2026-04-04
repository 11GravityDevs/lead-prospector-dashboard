import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/types/database";

export const ITEMS_PER_PAGE = 20;

export interface LeadsParams {
  q?: string;
  niche?: string;
  status?: string;
  city?: string;
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
      "id, created_at, company_name, phone, phone_whatsapp, address, city, state, niche_slug, status, contacted_at, rating, review_count, website, gmb_link, business_description, business_summary, positive_points, negative_points, general_perception, ai_opportunity, personalized_message",
      { count: "exact" },
    );

  if (params.q) {
    query = query.ilike("company_name", `%${params.q}%`);
  }

  if (params.niche) {
    query = query.eq("niche_slug", params.niche);
  }

  if (params.status) {
    query = query.eq("status", params.status as LeadStatus);
  }

  if (params.city) {
    query = query.eq("city", params.city);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)
    .overrideTypes<Lead[]>();

  return { leads: data ?? [], total: count ?? 0 };
}

export async function getNichesForFilter(): Promise<
  { slug: string; name: string }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("niches")
    .select("slug, name")
    .eq("active", true)
    .order("sort_order")
    .overrideTypes<{ slug: string; name: string }[]>();

  return data ?? [];
}

export async function getDistinctCities(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("city")
    .overrideTypes<{ city: string | null }[]>();

  const cities = new Set<string>();
  for (const row of data ?? []) {
    if (row.city) cities.add(row.city);
  }

  return Array.from(cities).sort();
}
