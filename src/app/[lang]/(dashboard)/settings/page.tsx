import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/brand/mascot";
import { VoiceToggles } from "@/components/settings/voice-toggles";
import { requireUser } from "@/lib/auth/session";
import { DAILY_GOAL_OPTIONS } from "@/lib/constants/app";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import { prisma } from "@/lib/db/prisma";
import { updateSettingsAction } from "@/server/actions/settings-actions";

export default async function SettingsPage({ params }: PageProps<"/[lang]/settings">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const user = await requireUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    redirect(withLocale(lang, "/courses"));
  }

  const dict = await getDictionary(lang);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={72} mood="think" />
        <h1 className="text-2xl font-black">{dict.settings.title}</h1>
      </div>
      <Card>
        <form action={updateSettingsAction} className="space-y-4">
          <Input name="displayName" label={dict.auth.name} defaultValue={profile.displayName} />
          <fieldset className="space-y-2">
            <legend className="text-sm font-extrabold text-ink-soft">{dict.settings.dailyGoal}</legend>
            <div className="flex flex-wrap gap-2">
              {DAILY_GOAL_OPTIONS.map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-line bg-paper px-4 py-2 font-extrabold"
                >
                  <input
                    type="radio"
                    name="dailyGoalXp"
                    value={value}
                    defaultChecked={profile.dailyGoalXp === value}
                  />
                  ⚡ {value} XP
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit">{dict.common.continue}</Button>
        </form>
      </Card>
      <Card>
        <VoiceToggles />
      </Card>
    </div>
  );
}
