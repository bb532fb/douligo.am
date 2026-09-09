import Link from "next/link";
import { Check, Lock, Star } from "lucide-react";
import { Mascot } from "@/components/brand/mascot";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import { cn } from "@/lib/utils/cn";
import type { PathLesson } from "@/types/learning";

const WAVE = [0, 56, 96, 48, 0, -48, -96, -56];

type LessonNodeProps = {
  lesson: PathLesson;
  index: number;
  locale: Locale;
  dict: Dictionary;
};

export function LessonNode({ lesson, index, locale, dict }: LessonNodeProps) {
  const locked = lesson.status === "locked";
  const current = lesson.status === "current";
  const offset = WAVE[index % WAVE.length] ?? 0;
  const node = (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {current ? <Mascot size={64} mood="happy" className="-mb-2" /> : null}
      <div
        className={cn(
          "flex h-[70px] w-[70px] items-center justify-center rounded-full border-4",
          lesson.status === "completed" && "border-gold-dark bg-gold text-ink shadow-[0_6px_0_0_#e5a100]",
          current && "border-brand-dark bg-brand text-white shadow-[0_6px_0_0_#46a302]",
          lesson.status === "available" && "border-teal bg-teal-soft text-teal-dark shadow-[0_6px_0_0_#1899d6]",
          locked && "border-[#cfcfcf] bg-[#e5e5e5] text-[#afafaf] shadow-[0_6px_0_0_#cfcfcf]",
        )}
      >
        {lesson.status === "completed" ? <Check className="h-8 w-8" strokeWidth={4} aria-label={dict.learn.completed} /> : null}
        {current ? <Star className="h-8 w-8 fill-white text-white" aria-label={dict.learn.current} /> : null}
        {lesson.status === "available" ? <Star className="h-7 w-7" aria-label={dict.learn.startHere} /> : null}
        {locked ? <Lock className="h-7 w-7" aria-label={dict.common.locked} /> : null}
      </div>
      {current ? (
        <span className="mt-3 rounded-xl bg-brand px-3 py-1 text-xs font-black tracking-wide text-white shadow-[0_3px_0_0_#46a302]">
          {dict.learn.startLesson}
        </span>
      ) : null}
      <p className="mt-2 max-w-[140px] text-center text-sm font-extrabold">{lesson.title}</p>
      <p className="text-xs font-bold text-ink-soft">{lesson.xpReward} XP</p>
    </div>
  );

  if (locked) {
    return <div aria-disabled="true">{node}</div>;
  }

  return (
    <Link
      href={withLocale(locale, `/lesson/${lesson.id}`)}
      prefetch={current}
      className="block focus-visible:rounded-3xl"
    >
      {node}
    </Link>
  );
}
