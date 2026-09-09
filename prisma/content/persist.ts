import { prisma } from "../../src/lib/db/prisma";
import type { BuiltLesson, BuiltUnit, BuiltWord } from "./build-course";

export async function clearLearningContent() {
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
  const wordIds = await createWords(courseId, built.words);
  await createUnits(courseId, built.units, wordIds);
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

async function createUnits(courseId: string, units: BuiltUnit[], wordIds: Map<string, string>) {
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
      await createLesson(savedUnit.id, lesson, wordIds);
    }
  }
}

async function createLesson(unitId: string, lesson: BuiltLesson, wordIds: Map<string, string>) {
  const savedLesson = await prisma.lesson.create({
    data: {
      unitId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      questions: {
        create: lesson.questions.map((question) => ({
          type: question.type,
          prompt: question.prompt,
          explanation: question.explanation,
          order: question.order,
          acceptedAnswers: question.acceptedAnswers,
          payload: question.payload ?? undefined,
          options: { create: question.options },
        })),
      },
    },
  });

  for (const key of lesson.wordKeys) {
    const vocabularyWordId = wordIds.get(key);
    if (!vocabularyWordId) {
      continue;
    }
    await prisma.lessonVocabulary.create({
      data: { lessonId: savedLesson.id, vocabularyWordId },
    });
  }
}
