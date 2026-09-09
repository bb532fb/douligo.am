import { prisma } from "../src/lib/db/prisma";
import { buildCourseContent } from "./content/build-course";
import { COURSE_SEEDS } from "./content/courses";
import type { BuiltLesson, BuiltUnit, BuiltWord } from "./content/build-course";

async function appendA2IfMissing() {
  for (const courseSeed of COURSE_SEEDS) {
    const course = await prisma.course.findUnique({ where: { slug: courseSeed.slug } });
    if (!course) {
      continue;
    }

    await prisma.course.update({
      where: { id: course.id },
      data: { description: courseSeed.description },
    });

    const hasA2 = await prisma.unit.findFirst({ where: { courseId: course.id, level: "A2" } });
    if (hasA2) {
      continue;
    }

    const built = buildCourseContent(courseSeed);
    const units = built.units.filter((unit) => unit.level === "A2");
    const wordKeys = new Set(units.flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.wordKeys)));
    const wordIds = await createWords(
      course.id,
      built.words.filter((word) => wordKeys.has(word.key)),
    );
    await createUnits(course.id, units, wordIds);
  }
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

appendA2IfMissing()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
