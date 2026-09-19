import { redirect } from "next/navigation";
import { LevelPicker } from "@/components/learning/level-picker";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import { courseService } from "@/server/services/course-service";

export default async function PlacementPage({ params }: PageProps<"/[lang]/onboarding/level">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const user = await requireUser();
  const placement = await courseService.getActivePlacement(user.id);
  if (!placement) {
    redirect(withLocale(lang, "/courses"));
  }
  if (!placement.needsPlacement) {
    redirect(withLocale(lang, "/learn"));
  }

  const dict = await getDictionary(lang);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={80} mood="wow" />
        <h1 className="text-3xl font-black">{dict.learn.chooseLevel}</h1>
      </div>
      <LevelPicker levels={placement.levels} dict={dict} variant="cards" />
    </div>
  );
}
