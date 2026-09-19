export const APP_NAME = "Lezoo";

export const HEARTS_MAX = 5;
export const HEARTS_MAX_MIN = 1;
export const HEARTS_MAX_LIMIT = 99;
export const XP_CORRECT_ANSWER = 2;
export const XP_LESSON_COMPLETE = 20;
export const XP_DAILY_GOAL = 50;
export const DEFAULT_DAILY_GOAL_XP = 50;
export const XP_PER_LEVEL = 100;

export const MASTERY_MAX = 100;
export const MASTERY_CORRECT_STEP = 15;
export const MASTERY_INCORRECT_STEP = 8;
export const MASTERY_LEARNING_MAX = 79;

export const DAILY_GOAL_OPTIONS = [20, 50, 100] as const;

export const COURSE_SLUGS = ["hy-en", "en-hy", "ru-hy", "hy-ru"] as const;

export const CEFR_LEVELS = ["A1", "A2", "B1"] as const;

export type CourseSlug = (typeof COURSE_SLUGS)[number];
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export function isCourseSlug(value: string): value is CourseSlug {
  return (COURSE_SLUGS as readonly string[]).includes(value);
}

export function isCefrLevel(value: string): value is CefrLevel {
  return (CEFR_LEVELS as readonly string[]).includes(value);
}
