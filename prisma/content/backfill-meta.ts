import { prisma } from "../../src/lib/db/prisma";
import { UNIT_ORDER } from "./courses";
import { questionMeta } from "./question-meta";
import { createSpecialLessons } from "./persist-special";
import { ensureTopics } from "./persist";
import { UNIT_TOPICS } from "./topics";
import type { BuiltQuestion } from "./build-course";
import type { CefrLevel } from "./types";

export async function backfillQuestionMeta() {
  const topics = await ensureTopics();
  const courses = await prisma.course.findMany({ include: { units: { include: { lessons: { include: { questions: true } } } } } });
  for (const course of courses) {
    const levelUnits = new Map<string, { id: string; order: number }>();
    for (const unit of course.units) {
      levelUnits.set(unit.level, { id: unit.id, order: unit.order });
      const unitKey = UNIT_ORDER[unit.order - 1];
      if (!unitKey) {
        continue;
      }
      for (const lesson of unit.lessons) {
        if (lesson.kind !== "STANDARD") {
          continue;
        }
        await linkTopics(lesson.id, unitKey, unit.level, topics);
        for (const question of lesson.questions) {
          const meta = questionMeta(asBuilt(question), unitKey, unit.level as CefrLevel, lesson.order, undefined, course.slug);
          await prisma.question.update({
            where: { id: question.id },
            data: {
              skillType: meta.skillType,
              difficulty: meta.difficulty,
              topicId: topics.get(`${meta.topicKey}:${unit.level}`),
            },
          });
        }
      }
    }
    const hasReview = course.units.some((unit) => unit.lessons.some((lesson) => lesson.kind === "REVIEW"));
    if (!hasReview) {
      await createSpecialLessons(course.id, levelUnits);
    }
  }
}

async function linkTopics(
  lessonId: string,
  unitKey: (typeof UNIT_ORDER)[number],
  level: string,
  topics: Map<string, string>,
) {
  for (const key of UNIT_TOPICS[unitKey]) {
    const topicId = topics.get(`${key}:${level}`);
    if (!topicId) {
      continue;
    }
    await prisma.lessonTopic.upsert({
      where: { lessonId_topicId: { lessonId, topicId } },
      update: {},
      create: { lessonId, topicId },
    });
  }
}

function asBuilt(question: { type: BuiltQuestion["type"]; prompt: string; acceptedAnswers: string[] }): BuiltQuestion {
  return {
    type: question.type,
    prompt: question.prompt,
    explanation: "",
    order: 1,
    acceptedAnswers: question.acceptedAnswers,
    payload: null,
    options: [],
  };
}
