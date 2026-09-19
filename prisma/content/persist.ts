import { prisma } from "../../src/lib/db/prisma";
import type { BuiltLesson, BuiltUnit, BuiltWord } from "./build-course";
import { questionMeta } from "./question-meta";
import { createSpecialLessons } from "./persist-special";
import { TOPIC_CATALOG, UNIT_TOPICS } from "./topics";
import type { UnitKey } from "./lexicon";
import type { CefrLevel } from "./types";

export async function clearLearningContent() {
  await prisma.reviewItem.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.topicMastery.deleteMany();
  await prisma.skillMastery.deleteMany();
  await prisma.levelMastery.deleteMany();
  await prisma.lessonTopic.deleteMany();
  await prisma.userAnswer.deleteMany();
  await prisma.lessonAttempt.deleteMany();
  await prisma.lessonVocabulary.deleteMany();
  await prisma.userVocabulary.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.vocabularyWord.deleteMany();
  await prisma.userProgress.updateMany({
    data: {
      currentUnitId: null,
      currentLessonId: null,
      totalLessonsCompleted: 0,
      totalWordsLearned: 0,
    },
  });
}

export async function writeCourseContent(
  courseId: string,
  built: { units: BuiltUnit[]; words: BuiltWord[] },
) {
  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
    select: { slug: true },
  });
  const topics = await ensureTopics();
  const wordIds = await createWords(courseId, built.words);
  const levelUnits = await createUnits(courseId, built.units, wordIds, topics, course.slug);
  await createSpecialLessons(courseId, levelUnits);
}

export async function ensureTopics() {
  const ids = new Map<string, string>();
  for (const topic of TOPIC_CATALOG) {
    const saved = await prisma.topic.upsert({
      where: { key_level: { key: topic.key, level: topic.level } },
      update: { title: topic.title, kind: topic.kind, isCritical: topic.isCritical },
      create: topic,
    });
    ids.set(`${topic.key}:${topic.level}`, saved.id);
  }
  return ids;
}

async function createWords(courseId: string, words: BuiltWord[]) {
  const wordIds = new Map<string, string>();
  for (const word of words) {
    const saved = await prisma.vocabularyWord.create({
      data: {
        courseId,
        sourceText: word.sourceText,
        targetText: word.targetText,
        pronunciation: word.pronunciation,
        exampleSentence: word.exampleSentence,
      },
    });
    wordIds.set(word.key, saved.id);
  }
  return wordIds;
}

async function createUnits(
  courseId: string,
  units: BuiltUnit[],
  wordIds: Map<string, string>,
  topics: Map<string, string>,
  slug: string,
) {
  const byLevel = new Map<string, { id: string; order: number }>();
  for (const unit of units) {
    const savedUnit = await prisma.unit.create({
      data: {
        courseId,
        title: unit.title,
        description: unit.description,
        order: unit.order,
        level: unit.level,
      },
    });
    for (const lesson of unit.lessons) {
      await createLesson(savedUnit.id, lesson, wordIds, topics, unit.unitKey, unit.level, slug);
    }
    byLevel.set(unit.level, { id: savedUnit.id, order: unit.order });
  }
  return byLevel;
}

async function createLesson(
  unitId: string,
  lesson: BuiltLesson,
  wordIds: Map<string, string>,
  topics: Map<string, string>,
  unitKey: UnitKey,
  level: string,
  slug: string,
) {
  const savedLesson = await prisma.lesson.create({
    data: {
      unitId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      kind: "STANDARD",
      questions: {
        create: lesson.questions.map((question) => {
          const meta = questionMeta(question, unitKey, level as CefrLevel, lesson.order, lesson.role, slug);
          return {
            type: question.type,
            prompt: question.prompt,
            explanation: question.explanation,
            order: question.order,
            acceptedAnswers: question.acceptedAnswers,
            payload: question.payload ?? undefined,
            skillType: meta.skillType,
            difficulty: meta.difficulty,
            topicId: topics.get(`${meta.topicKey}:${level}`),
            options: { create: question.options },
          };
        }),
      },
    },
  });
  await linkLessonTopics(savedLesson.id, unitKey, level, topics);
  await linkLessonWords(savedLesson.id, lesson.wordKeys, wordIds);
}

async function linkLessonTopics(
  lessonId: string,
  unitKey: UnitKey,
  level: string,
  topics: Map<string, string>,
) {
  for (const key of UNIT_TOPICS[unitKey]) {
    const topicId = topics.get(`${key}:${level}`);
    if (!topicId) {
      continue;
    }
    await prisma.lessonTopic.create({ data: { lessonId, topicId } });
  }
}

async function linkLessonWords(lessonId: string, wordKeys: string[], wordIds: Map<string, string>) {
  for (const key of wordKeys) {
    const vocabularyWordId = wordIds.get(key);
    if (!vocabularyWordId) {
      continue;
    }
    await prisma.lessonVocabulary.create({ data: { lessonId, vocabularyWordId } });
  }
}
