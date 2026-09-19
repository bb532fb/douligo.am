import { CourseCard } from "@/components/learning/course-card";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import { isCourseSlug } from "@/lib/constants/app";
import { courseService } from "@/server/services/course-service";

const FLAGS: Record<string, string> = {
  "hy-en": "🇦🇲 → 🇬🇧",
  "en-hy": "🇬🇧 → 🇦🇲",
  "ru-hy": "🇷🇺 → 🇦🇲",
  "hy-ru": "🇦🇲 → 🇷🇺",
};

const SMILES = ["🌟", "🎈", "🎯", "🚀"];

export default async function CoursesPage({ params }: PageProps<"/[lang]/courses">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return null;
  }

  const user = await requireUser();
  const dict = await getDictionary(lang);
  const [courses, active] = await Promise.all([
    courseService.listPublished(),
    courseService.requireActiveCourse(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={80} mood="wow" />
        <div>
          <h1 className="text-3xl font-black">{dict.learn.selectCourse}</h1>
          <p className="mt-1 font-semibold text-ink-soft">{dict.learn.selectCourseLead}</p>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {courses.map((course, index) => {
          const slug = isCourseSlug(course.slug) ? course.slug : null;
          return (
            <li key={course.id}>
              <CourseCard
                href={withLocale(lang, `/start/${course.slug}`)}
                title={slug ? dict.home.pairs[slug] : course.title}
                lead={slug ? dict.home.pairLeads[slug] : course.description}
                flag={FLAGS[course.slug] ?? "🌐"}
                smile={SMILES[index % SMILES.length] ?? "🌟"}
                continueLabel={dict.common.continue}
                current={course.id === active?.id}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
