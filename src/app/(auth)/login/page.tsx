"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/actions/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full py-3">
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

function LoginPage() {
  const [state, formAction] = useActionState(login, {
    success: true,
  });

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">
            Lead Prospector
          </h1>
          <p className="text-sm text-text-secondary">
            Dashboard de prospecção B2B
          </p>
        </div>
        <form action={formAction} className="flex w-full flex-col gap-4">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            required
            autoComplete="current-password"
          />
          {state?.error && (
            <p className="text-sm text-error">{state.error}</p>
          )}
          <SubmitButton />
        </form>
        <p className="text-sm text-text-secondary">
          Não tem uma conta?{" "}
          <Link href="/signup" className="text-green-400 hover:text-green-300">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
