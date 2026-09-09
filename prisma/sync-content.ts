import { prisma } from "../src/lib/db/prisma";
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
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
