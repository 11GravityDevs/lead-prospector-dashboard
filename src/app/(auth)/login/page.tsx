"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

function LoginPage() {
  function handleLogin() {
    const supabase = createBrowserClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">
            Lead Prospector
          </h1>
          <p className="text-sm text-text-secondary">
            Dashboard de prospeccao B2B
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full rounded-md bg-green-500 px-4 py-3 text-sm font-medium text-text-inverse transition-colors duration-150 hover:bg-green-600"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
