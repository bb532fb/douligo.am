import { UnitBanner } from "@/components/learning/unit-banner";
import { LessonNode } from "@/components/learning/lesson-node";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { PathUnit } from "@/types/learning";

type CoursePathProps = {
  units: PathUnit[];
  locale: Locale;
  dict: Dictionary;
};

export function CoursePath({ units, locale, dict }: CoursePathProps) {
  return (
    <ol className="space-y-10">
      {units.map((unit, unitIndex) => (
        <li key={unit.id} className="space-y-8">
          {unitIndex === 0 || unit.level !== units[unitIndex - 1]?.level ? (
            <p className="text-center text-sm font-black tracking-[0.28em] text-ink-soft">{unit.level}</p>
          ) : null}
          <UnitBanner
            title={unit.title}
            description={unit.description}
            level={unit.level}
            index={unitIndex}
          />
          <ol className="relative flex flex-col items-center gap-8 py-4">
            <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 rounded-full bg-line" aria-hidden="true" />
            {unit.lessons.map((lesson, lessonIndex) => (
              <li key={lesson.id} className="relative z-[1]">
                <LessonNode lesson={lesson} index={lessonIndex} locale={locale} dict={dict} />
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
