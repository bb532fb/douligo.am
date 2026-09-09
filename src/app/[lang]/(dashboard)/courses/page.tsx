import { selectCourseAction } from "@/server/actions/course-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { CourseSlug } from "@/lib/constants/app";
import { courseService } from "@/server/services/course-service";

const FLAGS: Record<string, string> = {
  "hy-en": "🇦🇲 → 🇬🇧",
  "en-hy": "🇬🇧 → 🇦🇲",
  "ru-hy": "🇷🇺 → 🇦🇲",
  "hy-ru": "🇦🇲 → 🇷🇺",
};

const SMILES = ["🌟", "🎈", "🎯", "🚀"];

function isCourseSlug(value: string): value is CourseSlug {
  return value in FLAGS;
}

export default async function CoursesPage({ params }: PageProps<"/[lang]/courses">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return null;
  }

  await requireUser();
  const dict = await getDictionary(lang);
  const courses = await courseService.listPublished();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={80} mood="wow" />
        <h1 className="text-3xl font-black">{dict.learn.selectCourse}</h1>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {courses.map((course, index) => {
          const slug = isCourseSlug(course.slug) ? course.slug : null;
          return (
            <li key={course.id}>
              <Card className="space-y-4">
                <p className="text-3xl">
                  {SMILES[index % SMILES.length]} {FLAGS[course.slug] ?? "🌐"}
                </p>
                <h2 className="text-xl font-black">
                  {slug ? dict.home.pairs[slug] : course.title}
                </h2>
                <p className="font-semibold text-ink-soft">
                  {slug ? dict.home.pairLeads[slug] : course.description}
                </p>
                <form action={selectCourseAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <Button type="submit" className="w-full">
                    {dict.common.continue}
                  </Button>
                </form>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
