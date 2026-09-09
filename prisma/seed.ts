import type { AchievementType } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { bumpContentCache } from "../src/lib/cache/remember";
import { prisma } from "../src/lib/db/prisma";
import { closeRedis } from "../src/lib/db/redis";
import { buildCourseContent } from "./content/build-course";
import { COURSE_SEEDS } from "./content/courses";
import { writeCourseContent } from "./content/persist";

const ACHIEVEMENTS: Array<{
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  threshold: number;
}> = [
  {
    type: "FIRST_LESSON",
    name: "Առաջին քայլ",
    description: "Ավարտիր առաջին դասը",
    icon: "sprout",
    threshold: 1,
  },
  {
    type: "LESSONS_COMPLETED",
    name: "Հաստատակամ",
    description: "Ավարտիր 5 դաս",
    icon: "book-open",
    threshold: 5,
  },
  {
    type: "STREAK_DAYS",
    name: "3 օրվա շարք",
    description: "Պահիր 3 օրվա շարք",
    icon: "flame",
    threshold: 3,
  },
  {
    type: "XP_TOTAL",
    name: "100 XP",
    description: "Հավաքիր 100 XP",
    icon: "star",
    threshold: 100,
  },
  {
    type: "WORDS_LEARNED",
    name: "Բառարան",
    description: "Սովորիր 10 բառ",
    icon: "library",
    threshold: 10,
  },
];

const DEMO_USERS = [
  { name: "Անի", email: "ani@lezu.app", xp: 820 },
  { name: "Արմեն", email: "armen@lezu.app", xp: 760 },
  { name: "Դավիթ", email: "david@lezu.app", xp: 710 },
];

async function seedCourses() {
  for (const courseSeed of COURSE_SEEDS) {
    const course = await prisma.course.upsert({
      where: { slug: courseSeed.slug },
      update: {
        title: courseSeed.title,
        description: courseSeed.description,
        isPublished: true,
      },
      create: courseSeed,
    });
    await writeCourseContent(course.id, buildCourseContent(courseSeed));
  }
}

async function seedAchievements() {
  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: {
        type_threshold: {
          type: achievement.type,
          threshold: achievement.threshold,
        },
      },
      update: achievement,
      create: achievement,
    });
  }
}

async function seedDemoUsers() {
  const passwordHash = await hashPassword("Password123");
  const firstCourse = await prisma.course.findUniqueOrThrow({ where: { slug: "hy-en" } });

  for (const demo of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {},
      create: {
        email: demo.email,
        name: demo.name,
        passwordHash,
        profile: {
          create: {
            displayName: demo.name,
            nativeLanguage: "HY",
          },
        },
        streak: {
          create: {
            currentStreak: 4,
            longestStreak: 7,
            lastActivityDate: new Date(),
          },
        },
      },
    });

    await prisma.userCourseEnrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: firstCourse.id } },
      update: { isActive: true },
      create: { userId: user.id, courseId: firstCourse.id, isActive: true },
    });

    await prisma.userProgress.upsert({
      where: { userId_courseId: { userId: user.id, courseId: firstCourse.id } },
      update: {},
      create: { userId: user.id, courseId: firstCourse.id },
    });

    await prisma.userXP.deleteMany({ where: { userId: user.id, source: "LESSON_COMPLETE" } });
    await prisma.userXP.create({
      data: {
        userId: user.id,
        amount: demo.xp,
        source: "LESSON_COMPLETE",
        sourceId: `seed-${user.id}`,
      },
    });
  }
}

async function main() {
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
  await prisma.userCourseEnrollment.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userXP.deleteMany();
  await prisma.dailyGoal.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.course.deleteMany();

  await seedCourses();
  await seedAchievements();
  await seedDemoUsers();
}

main()
  .then(async () => {
    await bumpContentCache();
    await prisma.$disconnect();
    await closeRedis();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    await closeRedis();
    process.exit(1);
  });
