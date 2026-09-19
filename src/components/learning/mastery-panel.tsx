import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";
import type { MasteryDashboard } from "@/types/mastery";
import { startAssessmentAction, startReviewAction } from "@/server/actions/learning-actions";

type MasteryPanelProps = {
  data: MasteryDashboard;
  dict: Dictionary;
  locale: Locale;
};

export function MasteryPanel({ data, dict, locale }: MasteryPanelProps) {
  const need = Math.max(0, data.unlock.required - data.overall);
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-ink-soft">{dict.mastery.currentLevel}</p>
            <h2 className="text-3xl font-black">{data.currentLevel}</h2>
          </div>
          <p className="text-sm font-bold text-ink-soft">
            {interpolate(dict.mastery.lessonsVsMastery, {
              lessons: String(data.lessonsTotal === 0 ? 0 : Math.round((data.lessonsCompleted / data.lessonsTotal) * 100)),
              mastery: String(data.overall),
            })}
          </p>
        </div>
        <ProgressBar label={dict.mastery.overall} value={data.overall} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.skills.map((skill) => (
            <li key={skill.skill}>
              <ProgressBar label={dict.mastery.skills[skill.skill]} value={skill.score} />
            </li>
          ))}
        </ul>
      </Card>
      <UnlockCard data={data} dict={dict} need={need} />
      <TopicLists data={data} dict={dict} locale={locale} />
    </div>
  );
}

function UnlockCard({
  data,
  dict,
  need,
}: {
  data: MasteryDashboard;
  dict: Dictionary;
  need: number;
}) {
  const next = data.unlock.nextLevel;
  if (!next) {
    return (
      <Card className="space-y-2 border-brand bg-brand-soft">
        <p className="text-lg font-black">{dict.mastery.trackComplete}</p>
      </Card>
    );
  }
  return (
    <Card className="space-y-4">
      <p className="text-lg font-black">
        {data.unlock.locked ? interpolate(dict.mastery.lockedLevel, { level: next }) : interpolate(dict.mastery.unlockedLevel, { level: next })}
      </p>
      <p className="font-bold text-ink-soft">
        {interpolate(dict.mastery.needMore, { level: next, need: String(need) })}
      </p>
      {data.unlock.gaps.length > 0 ? (
        <ul className="space-y-2">
          {data.unlock.gaps.map((gap) => (
            <li key={`${gap.kind}-${gap.key}`} className="text-sm font-bold">
              {gapLabel(gap.kind, gap.key, dict)}: {gapValue(gap)}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        {data.assessmentAvailable && data.assessmentLessonId ? (
          <form action={startAssessmentAction}>
            <input type="hidden" name="level" value={data.currentLevel} />
            <Button type="submit" className="w-full sm:w-auto">
              {dict.mastery.finalAssessment}
            </Button>
          </form>
        ) : null}
        {data.reviewLessonId ? (
          <form action={startReviewAction}>
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
              {dict.mastery.practiceWeak}
            </Button>
          </form>
        ) : null}
      </div>
      {data.lastAssessmentScore != null ? (
        <p className="text-sm font-bold text-ink-soft">
          {interpolate(dict.mastery.lastAssessment, {
            score: String(data.lastAssessmentScore),
            result: data.lastAssessmentPassed ? dict.mastery.passed : dict.mastery.failed,
          })}
        </p>
      ) : null}
    </Card>
  );
}

function TopicLists({ data, dict, locale }: { data: MasteryDashboard; dict: Dictionary; locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="space-y-3">
        <p className="font-black">{dict.mastery.weakTopics}</p>
        {data.weakTopics.length === 0 ? (
          <p className="font-bold text-ink-soft">{dict.mastery.noWeakTopics}</p>
        ) : (
          <ul className="space-y-2">
            {data.weakTopics.map((topic) => (
              <li key={topic.key} className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>{dict.topics[topic.key as keyof typeof dict.topics] ?? topic.title}</span>
                <span>{topic.score}%</span>
              </li>
            ))}
          </ul>
        )}
        {data.reviewLessonId ? (
          <form action={startReviewAction}>
            <Button type="submit" variant="secondary" className="w-full">
              {dict.mastery.practiceWeak}
            </Button>
          </form>
        ) : null}
      </Card>
      <Card className="space-y-3">
        <p className="font-black">{dict.mastery.recentlyLearned}</p>
        {data.recentlyLearned.length === 0 ? (
          <p className="font-bold text-ink-soft">{dict.mastery.noRecent}</p>
        ) : (
          <ul className="space-y-2">
            {data.recentlyLearned.map((topic) => (
              <li key={topic.key} className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>{dict.topics[topic.key as keyof typeof dict.topics] ?? topic.title}</span>
                <span>{topic.score}%</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm font-bold text-ink-soft">
          {interpolate(dict.mastery.reviewDue, { count: String(data.reviewDue) })}
        </p>
        <Button href={withLocale(locale, "/learn")} variant="ghost" className="w-full">
          {dict.learn.continueLesson}
        </Button>
      </Card>
    </div>
  );
}

function gapLabel(kind: string, key: string, dict: Dictionary) {
  if (kind === "overall") {
    return dict.mastery.overall;
  }
  if (kind === "assessment") {
    return dict.mastery.finalAssessment;
  }
  if (kind === "lessons") {
    return dict.mastery.lessonsGap;
  }
  if (kind === "review") {
    return dict.mastery.reviewGap;
  }
  if (kind === "skill" && key in dict.mastery.skills) {
    return dict.mastery.skills[key as keyof typeof dict.mastery.skills];
  }
  return dict.topics[key as keyof typeof dict.topics] ?? key;
}

function gapValue(gap: { kind: string; current: number; required: number }) {
  if (gap.kind === "lessons") {
    return `${Math.round(gap.current)} / ${gap.required}`;
  }
  if (gap.kind === "review") {
    return String(Math.round(gap.current));
  }
  return `${Math.round(gap.current)}% → ${gap.required}%`;
}
