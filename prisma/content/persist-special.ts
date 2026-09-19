import { prisma } from "../../src/lib/db/prisma";

const ASSESSMENT_TITLES: Record<string, string> = {
  A1: "A1 Final Assessment",
  A2: "A2 Final Assessment",
  B1: "B1 Final Assessment",
  B2: "B2 Final Assessment",
  C1: "C1 Final Assessment",
};

export async function createSpecialLessons(
  courseId: string,
  levelUnits: Map<string, { id: string; order: number }>,
) {
  const first = [...levelUnits.values()].sort((left, right) => left.order - right.order)[0];
  if (first) {
    await prisma.lesson.create({
      data: {
        unitId: first.id,
        title: "Review",
        description: "Spaced review of weak topics",
        order: 90,
        kind: "REVIEW",
        xpReward: 15,
        estimatedMinutes: 8,
      },
    });
  }

  for (const [level, unit] of levelUnits) {
    await prisma.lesson.create({
      data: {
        unitId: unit.id,
        title: ASSESSMENT_TITLES[level] ?? `${level} Final Assessment`,
        description: `Mixed assessment for ${level}`,
        order: 99,
        kind: "ASSESSMENT",
        xpReward: 30,
        estimatedMinutes: 15,
      },
    });
  }
  return courseId;
}
