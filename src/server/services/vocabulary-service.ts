import { matchesMasteryFilter, type MasteryFilter } from "@/lib/gamification/mastery";
import { vocabularyRepository } from "@/server/repositories/vocabulary-repository";

export const vocabularyService = {
  async list(userId: string, courseId: string, query: string, filter: MasteryFilter) {
    const items = await vocabularyRepository.listByCourse(userId, courseId);
    const normalized = query.trim().toLocaleLowerCase("und");

    return items.filter((item) => {
      if (!matchesMasteryFilter(item.mastery, filter)) {
        return false;
      }
      if (!normalized) {
        return true;
      }

      const haystack = [
        item.vocabularyWord.sourceText,
        item.vocabularyWord.targetText,
        item.vocabularyWord.pronunciation,
      ]
        .join(" ")
        .toLocaleLowerCase("und");
      return haystack.includes(normalized);
    });
  },
};
