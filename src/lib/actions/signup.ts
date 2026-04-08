"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SignupState = {
  success: boolean;
  error?: string;
};

export async function signup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("name") as string,
      },
    },
  });

  if (error) {
    return { success: false, error: "Não foi possível criar a conta" };
  }

  redirect("/");
}
