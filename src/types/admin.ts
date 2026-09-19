import type { UserRole, UserStatus } from "@prisma/client";

export type AdminUserStatus = UserStatus;
export type AdminUserRole = UserRole;

export type AdminOverviewStats = {
  totalUsers: number;
  activeToday: number;
  newThisWeek: number;
  suspended: number;
  lessonsToday: number;
};

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  hearts: number;
  level: number;
  currentStreak: number;
  lastActivityDate: Date | null;
  totalXp: number;
  lessonsCompleted: number;
};

export type AdminUserList = {
  items: AdminUserListItem[];
  page: number;
  pageSize: number;
  total: number;
};

export type AdminLessonRow = {
  id: string;
  title: string;
  score: number;
  completedAt: Date;
};

export type AdminAnswerRow = {
  id: string;
  prompt: string;
  isCorrect: boolean;
  createdAt: Date;
};

export type AdminCourseRow = {
  id: string;
  title: string;
  isActive: boolean;
};

export type AdminUserDetail = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  hearts: number;
  level: number;
  dailyGoalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  totalXp: number;
  lessonsCompleted: number;
  wordsLearned: number;
  accuracy: number;
  courses: AdminCourseRow[];
  recentLessons: AdminLessonRow[];
  recentAnswers: AdminAnswerRow[];
};

export type AdminActivityKind = "signup" | "lesson";

export type AdminActivityItem = {
  id: string;
  kind: AdminActivityKind;
  at: Date;
  userId: string;
  userName: string;
  title: string;
};
