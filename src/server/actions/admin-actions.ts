"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { APP_ERRORS } from "@/lib/constants/copy";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { translateError, translateErrorKey } from "@/i18n/errors";
import { getRequestLocale } from "@/i18n/request-locale";
import { withLocale } from "@/i18n/path";
import { adjustHeartsSchema, updateHeartsMaxSchema, updateUserStatusSchema } from "@/lib/validations/admin";
import { adminService } from "@/server/services/admin-service";

export type AdminActionResult = {
  ok: boolean;
  message?: string;
};

function revalidateAdmin(userId: string) {
  for (const locale of LOCALES) {
    revalidatePath(withLocale(locale, "/admin"));
    revalidatePath(withLocale(locale, "/admin/users"));
    revalidatePath(withLocale(locale, `/admin/users/${userId}`));
    revalidatePath(withLocale(locale, "/admin/activity"));
  }
}

function revalidateHeartsMax() {
  for (const locale of LOCALES) {
    revalidatePath(withLocale(locale, "/admin"));
    revalidatePath(withLocale(locale, "/admin/users"), "layout");
    revalidatePath(withLocale(locale, "/learn"));
  }
}

export async function adjustHeartsAction(
  _: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  await requireAdmin();
  const parsed = adjustHeartsSchema.safeParse({
    userId: formData.get("userId"),
    intent: formData.get("intent"),
  });
  if (!parsed.success) {
    return { ok: false, message: translateErrorKey(parsed.error.issues[0]?.message, dict) };
  }

  try {
    await adminService.changeHearts(parsed.data.userId, parsed.data.intent);
    revalidateAdmin(parsed.data.userId);
    return { ok: true, message: dict.admin.heartsUpdated };
  } catch (error) {
    return { ok: false, message: translateError(error, dict, APP_ERRORS.generic) };
  }
}

export async function updateHeartsMaxAction(
  _: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  await requireAdmin();
  const parsed = updateHeartsMaxSchema.safeParse({
    heartsMax: formData.get("heartsMax"),
  });
  if (!parsed.success) {
    return { ok: false, message: translateErrorKey(parsed.error.issues[0]?.message, dict) };
  }

  try {
    await adminService.setHeartsMax(parsed.data.heartsMax);
    revalidateHeartsMax();
    return { ok: true, message: dict.admin.heartsMaxUpdated };
  } catch (error) {
    return { ok: false, message: translateError(error, dict, APP_ERRORS.generic) };
  }
}

export async function updateUserStatusAction(
  _: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const admin = await requireAdmin();
  const parsed = updateUserStatusSchema.safeParse({
    userId: formData.get("userId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { ok: false, message: translateErrorKey(parsed.error.issues[0]?.message, dict) };
  }

  try {
    await adminService.changeStatus(admin.id, parsed.data.userId, parsed.data.status);
    revalidateAdmin(parsed.data.userId);
    return { ok: true, message: dict.admin.statusUpdated };
  } catch (error) {
    return { ok: false, message: translateError(error, dict, APP_ERRORS.generic) };
  }
}
