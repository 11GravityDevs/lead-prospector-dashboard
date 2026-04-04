import { createClient } from "@/lib/supabase/server";
import type { Setting } from "@/types/database";

export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .overrideTypes<Pick<Setting, "key" | "value">[]>();

  if (!data) return {};

  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}
