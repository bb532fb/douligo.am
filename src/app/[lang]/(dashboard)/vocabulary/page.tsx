import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { VocabCard } from "@/components/vocabulary/vocab-card";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import type { MasteryFilter } from "@/lib/gamification/mastery";
import { courseService } from "@/server/services/course-service";
import { vocabularyService } from "@/server/services/vocabulary-service";

type VocabularyPageProps = PageProps<"/[lang]/vocabulary"> & {
  searchParams: Promise<{ q?: string; filter?: string }>;
};

function asFilter(value: string | undefined): MasteryFilter {
  if (value === "learning" || value === "mastered") {
    return value;
  }
  return "all";
}

export default async function VocabularyPage({ params, searchParams }: VocabularyPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const user = await requireUser();
  const course = await courseService.requireActiveCourse(user.id);
  if (!course) {
    redirect(withLocale(lang, "/courses"));
  }

  const dict = await getDictionary(lang);
  const query = await searchParams;
  const filter = asFilter(query.filter);
  const words = await vocabularyService.list(user.id, course.id, query.q ?? "", filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={80} mood="think" />
        <h1 className="text-3xl font-black">{dict.nav.vocabulary}</h1>
      </div>
      <form className="space-y-3" method="get">
        <label className="block">
          <span className="sr-only">{dict.vocabulary.search}</span>
          <input
            name="q"
            defaultValue={query.q}
            placeholder={dict.vocabulary.search}
            className="tap-target w-full rounded-2xl border-2 border-b-4 border-line bg-paper-raised px-4 font-semibold"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", dict.vocabulary.filterAll],
              ["learning", dict.vocabulary.filterLearning],
              ["mastered", dict.vocabulary.filterMastered],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              name="filter"
              value={value}
              className={`rounded-full border-2 px-4 py-2 text-sm font-extrabold ${
                filter === value
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-paper-raised text-ink-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </form>
      {words.length === 0 ? (
        <EmptyState title={dict.vocabulary.empty} />
      ) : (
        <ul className="space-y-3">
          {words.map((item) => (
            <li key={item.id}>
              <VocabCard
                targetText={item.vocabularyWord.targetText}
                sourceText={item.vocabularyWord.sourceText}
                pronunciation={item.vocabularyWord.pronunciation}
                exampleSentence={item.vocabularyWord.exampleSentence}
                mastery={item.mastery}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
