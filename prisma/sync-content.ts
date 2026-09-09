import { bumpContentCache } from "../src/lib/cache/remember";
import { prisma } from "../src/lib/db/prisma";
import { closeRedis } from "../src/lib/db/redis";
import { buildCourseContent } from "./content/build-course";
import { COURSE_SEEDS } from "./content/courses";
import { clearLearningContent, writeCourseContent } from "./content/persist";

async function syncContent() {
  await clearLearningContent();

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

syncContent()
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
