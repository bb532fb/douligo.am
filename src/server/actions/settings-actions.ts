"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { APP_ERRORS } from "@/lib/constants/copy";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { LOCALES } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { profileService } from "@/server/services/profile-service";

export async function updateSettingsAction(formData: FormData) {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const user = await requireUser();
  const parsed = updateSettingsSchema.safeParse({
    displayName: formData.get("displayName") || undefined,
    dailyGoalXp: Number(formData.get("dailyGoalXp")),
  });

  if (!parsed.success) {
    throw new Error(dict.errors[APP_ERRORS.validation]);
  }

  await profileService.updateSettings(user.id, parsed.data);
  for (const item of LOCALES) {
    revalidatePath(withLocale(item, "/profile"));
    revalidatePath(withLocale(item, "/settings"));
  }
}
