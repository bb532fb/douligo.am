"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";
import { withLocale } from "@/i18n/path";
import type { ActionResult } from "@/server/actions/auth-actions";

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: ActionResult, formData: FormData) => Promise<ActionResult>;
};

const initial: ActionResult = { ok: false };

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initial);
  const { locale, dict } = useI18n();

  return (
    <Card>
      <h1 className="mb-6 text-center text-2xl font-black">
        {mode === "login" ? `👋 ${dict.auth.login}` : `🎉 ${dict.auth.register}`}
      </h1>
      <form action={formAction} className="space-y-4">
        {mode === "register" ? <Input name="name" label={dict.auth.name} autoComplete="name" required /> : null}
        <Input name="email" type="email" label={dict.auth.email} autoComplete="email" required />
        <Input
          name="password"
          type="password"
          label={dict.auth.password}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
        {mode === "register" ? (
          <Input
            name="confirmPassword"
            type="password"
            label={dict.auth.confirmPassword}
            autoComplete="new-password"
            required
          />
        ) : null}
        {state.message ? (
          <p className="text-sm font-bold text-rose" role="alert">
            {state.message}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={pending}>
          {mode === "login" ? dict.auth.login : dict.auth.register}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm font-semibold text-ink-soft">
        {mode === "login" ? dict.auth.noAccount : dict.auth.alreadyHaveAccount}{" "}
        <Link
          className="font-extrabold text-teal"
          href={withLocale(locale, mode === "login" ? "/register" : "/login")}
        >
          {mode === "login" ? dict.auth.register : dict.auth.login}
        </Link>
      </p>
    </Card>
  );
}
