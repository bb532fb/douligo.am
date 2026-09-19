import { HEARTS_MAX } from "@/lib/constants/app";
import { prisma } from "@/lib/db/prisma";

const SETTINGS_ID = "default";

export const settingsRepository = {
  async getHeartsMax() {
    const row = await prisma.appSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      create: { id: SETTINGS_ID, heartsMax: HEARTS_MAX },
    });
    return row.heartsMax;
  },

  async setHeartsMax(heartsMax: number) {
    const row = await prisma.appSettings.upsert({
      where: { id: SETTINGS_ID },
      update: { heartsMax },
      create: { id: SETTINGS_ID, heartsMax },
    });
    return row.heartsMax;
  },

  clampHeartsAbove(max: number) {
    return prisma.profile.updateMany({
      where: { hearts: { gt: max } },
      data: { hearts: max },
    });
  },

  fillHeartsAt(oldMax: number, newMax: number) {
    return prisma.profile.updateMany({
      where: { hearts: oldMax },
      data: { hearts: newMax },
    });
  },
};
