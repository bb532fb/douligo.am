export const APP_NAME = "Lezu";

export const HEARTS_MAX = 5;
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

export type CourseSlug = (typeof COURSE_SLUGS)[number];
