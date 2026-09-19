"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth/auth";
import { AUTH_ERRORS, APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { safeCallbackUrl } from "@/lib/auth/callback-url";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { translateError, translateErrorKey } from "@/i18n/errors";
import { withLocale } from "@/i18n/path";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { authService } from "@/server/services/auth-service";
import { userRepository } from "@/server/repositories/user-repository";

export type ActionResult = {
  ok: boolean;
  message?: string;
};

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: unknown }).digest).includes("NEXT_REDIRECT")
  );
}

export async function registerAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, message: translateErrorKey(parsed.error.issues[0]?.message, dict) };
  }

  try {
    await authService.register(parsed.data);
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl"), locale) ?? withLocale(locale, "/courses"),
    });
    return { ok: true };
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { ok: false, message: dict.errors[AUTH_ERRORS.invalidCredentials] };
    }
    return { ok: false, message: translateError(error, dict, APP_ERRORS.generic) };
  }
}

export async function loginAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: translateErrorKey(parsed.error.issues[0]?.message, dict) };
  }

  const existing = await userRepository.findByEmail(parsed.data.email);
  if (existing?.status === "SUSPENDED") {
    return { ok: false, message: dict.errors[APP_ERRORS.accountSuspended] };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl"), locale) ?? withLocale(locale, "/learn"),
    });
    return { ok: true };
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { ok: false, message: dict.errors[AUTH_ERRORS.invalidCredentials] };
    }
    if (error instanceof AppError) {
      return { ok: false, message: translateError(error, dict) };
    }
    throw error;
  }
}

export async function logoutAction() {
  const locale = await getRequestLocale();
  await signOut({ redirectTo: withLocale(locale, "/") });
  redirect(withLocale(locale, "/"));
}
