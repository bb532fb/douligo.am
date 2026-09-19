import { UnitBanner } from "@/components/learning/unit-banner";
import { LessonNode } from "@/components/learning/lesson-node";
import { LevelGate } from "@/components/learning/level-gate";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { PathUnit } from "@/types/learning";

type CoursePathProps = {
  units: PathUnit[];
  locale: Locale;
  dict: Dictionary;
  accessibleLevels: string[];
};

export function CoursePath({ units, locale, dict, accessibleLevels }: CoursePathProps) {
  const open = new Set(accessibleLevels);
  return (
    <ol className="space-y-10">
      {units.map((unit, unitIndex) => (
        <li key={unit.id} className="space-y-8">
          <LevelBreak units={units} index={unitIndex} open={open} locale={locale} dict={dict} />
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

function LevelBreak({
  units,
  index,
  open,
  locale,
  dict,
}: {
  units: PathUnit[];
  index: number;
  open: Set<string>;
  locale: Locale;
  dict: Dictionary;
}) {
  const unit = units[index];
  if (!unit) {
    return null;
  }
  const prev = units[index - 1];
  if (index !== 0 && unit.level === prev?.level) {
    return null;
  }
  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-black tracking-[0.28em] text-ink-soft">{unit.level}</p>
      {index > 0 && !open.has(unit.level) ? (
        <LevelGate nextLevel={unit.level} locale={locale} dict={dict} />
      ) : null}
    </div>
  );
}
