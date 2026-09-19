import { bumpContentCache } from "../src/lib/cache/remember";
import { prisma } from "../src/lib/db/prisma";
import { closeRedis } from "../src/lib/db/redis";
import { backfillQuestionMeta } from "./content/backfill-meta";

backfillQuestionMeta()
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
