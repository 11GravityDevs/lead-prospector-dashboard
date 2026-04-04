"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface SaveSettingsInput {
  key: string;
  value: string;
}

export async function saveSettings(
  settings: SaveSettingsInput[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  for (const { key, value } of settings) {
    const { error } = await supabase
      .from("settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (error) {
      return { success: false, error: `Erro ao salvar ${key}` };
    }
  }

  revalidatePath("/settings");
  return { success: true };
}
