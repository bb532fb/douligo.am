import { settingsRepository } from "@/server/repositories/settings-repository";

export const settingsService = {
  getHeartsMax() {
    return settingsRepository.getHeartsMax();
  },

  async setHeartsMax(heartsMax: number) {
    const previous = await settingsRepository.getHeartsMax();
    const next = await settingsRepository.setHeartsMax(heartsMax);
    if (next < previous) {
      await settingsRepository.clampHeartsAbove(next);
    } else if (next > previous) {
      await settingsRepository.fillHeartsAt(previous, next);
    }
    return next;
  },
};
