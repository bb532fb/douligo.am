-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('VOCABULARY', 'GRAMMAR', 'LISTENING', 'READING', 'TRANSLATION');

-- CreateEnum
CREATE TYPE "ExerciseDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "KnowledgeState" AS ENUM ('NEW', 'LEARNING', 'WEAK', 'LEARNED', 'MASTERED');

-- CreateEnum
CREATE TYPE "LessonKind" AS ENUM ('STANDARD', 'REVIEW', 'ASSESSMENT');

-- CreateEnum
CREATE TYPE "TopicKind" AS ENUM ('VOCABULARY', 'GRAMMAR');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "kind" "LessonKind" NOT NULL DEFAULT 'STANDARD';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "skillType" "SkillType" NOT NULL DEFAULT 'VOCABULARY';
ALTER TABLE "Question" ADD COLUMN "difficulty" "ExerciseDifficulty" NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE "Question" ADD COLUMN "topicId" TEXT;

-- AlterTable
ALTER TABLE "UserVocabulary" ADD COLUMN "knowledgeState" "KnowledgeState" NOT NULL DEFAULT 'NEW';
ALTER TABLE "UserVocabulary" ADD COLUMN "intervalDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UserVocabulary" ADD COLUMN "repetitions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UserVocabulary" ADD COLUMN "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5;

-- AlterTable
ALTER TABLE "UserAnswer" ADD COLUMN "timeSpentMs" INTEGER;
ALTER TABLE "UserAnswer" ADD COLUMN "attemptNumber" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "UserAnswer" ADD COLUMN "skillType" "SkillType";
ALTER TABLE "UserAnswer" ADD COLUMN "topicId" TEXT;
ALTER TABLE "UserAnswer" ADD COLUMN "unitId" TEXT;
ALTER TABLE "UserAnswer" ADD COLUMN "levelKey" TEXT;

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "TopicKind" NOT NULL,
    "level" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonTopic" (
    "lessonId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "LessonTopic_pkey" PRIMARY KEY ("lessonId","topicId")
);

-- CreateTable
CREATE TABLE "TopicMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "evidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "knowledgeState" "KnowledgeState" NOT NULL DEFAULT 'NEW',
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "consecutiveCorrect" INTEGER NOT NULL DEFAULT 0,
    "consecutiveWrong" INTEGER NOT NULL DEFAULT 0,
    "lastResultCorrect" BOOLEAN,
    "lastPracticedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "intervalIndex" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "levelKey" TEXT NOT NULL,
    "skillType" "SkillType" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "levelKey" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "lessonsTotal" INTEGER NOT NULL DEFAULT 0,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "lastAssessmentScore" INTEGER,
    "lastAssessmentPassed" BOOLEAN,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "levelKey" TEXT NOT NULL,
    "lessonId" TEXT,
    "attemptId" TEXT,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "questionIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "topicId" TEXT,
    "vocabularyWordId" TEXT,
    "questionId" TEXT,
    "knowledgeState" "KnowledgeState" NOT NULL DEFAULT 'LEARNING',
    "intervalIndex" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "lastReviewedAt" TIMESTAMP(3),
    "lastCorrect" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_key_level_key" ON "Topic"("key", "level");
CREATE INDEX "Topic_level_kind_idx" ON "Topic"("level", "kind");
CREATE INDEX "LessonTopic_topicId_idx" ON "LessonTopic"("topicId");
CREATE UNIQUE INDEX "TopicMastery_userId_courseId_topicId_key" ON "TopicMastery"("userId", "courseId", "topicId");
CREATE INDEX "TopicMastery_userId_courseId_idx" ON "TopicMastery"("userId", "courseId");
CREATE INDEX "TopicMastery_userId_nextReviewAt_idx" ON "TopicMastery"("userId", "nextReviewAt");
CREATE INDEX "TopicMastery_userId_courseId_score_idx" ON "TopicMastery"("userId", "courseId", "score");
CREATE UNIQUE INDEX "SkillMastery_userId_courseId_levelKey_skillType_key" ON "SkillMastery"("userId", "courseId", "levelKey", "skillType");
CREATE INDEX "SkillMastery_userId_courseId_levelKey_idx" ON "SkillMastery"("userId", "courseId", "levelKey");
CREATE UNIQUE INDEX "LevelMastery_userId_courseId_levelKey_key" ON "LevelMastery"("userId", "courseId", "levelKey");
CREATE INDEX "LevelMastery_userId_courseId_idx" ON "LevelMastery"("userId", "courseId");
CREATE INDEX "AssessmentAttempt_userId_courseId_levelKey_createdAt_idx" ON "AssessmentAttempt"("userId", "courseId", "levelKey", "createdAt");
CREATE UNIQUE INDEX "ReviewItem_userId_courseId_questionId_key" ON "ReviewItem"("userId", "courseId", "questionId");
CREATE INDEX "ReviewItem_userId_courseId_nextReviewAt_idx" ON "ReviewItem"("userId", "courseId", "nextReviewAt");
CREATE INDEX "ReviewItem_userId_topicId_idx" ON "ReviewItem"("userId", "topicId");
CREATE INDEX "Lesson_kind_idx" ON "Lesson"("kind");
CREATE INDEX "Question_topicId_idx" ON "Question"("topicId");
CREATE INDEX "Question_skillType_difficulty_idx" ON "Question"("skillType", "difficulty");
CREATE INDEX "UserVocabulary_userId_nextReviewAt_idx" ON "UserVocabulary"("userId", "nextReviewAt");
CREATE INDEX "UserAnswer_userId_topicId_createdAt_idx" ON "UserAnswer"("userId", "topicId", "createdAt");
CREATE INDEX "UserAnswer_userId_skillType_createdAt_idx" ON "UserAnswer"("userId", "skillType", "createdAt");
CREATE INDEX "UserAnswer_userId_levelKey_createdAt_idx" ON "UserAnswer"("userId", "levelKey", "createdAt");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LessonTopic" ADD CONSTRAINT "LessonTopic_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonTopic" ADD CONSTRAINT "LessonTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SkillMastery" ADD CONSTRAINT "SkillMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SkillMastery" ADD CONSTRAINT "SkillMastery_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LevelMastery" ADD CONSTRAINT "LevelMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LevelMastery" ADD CONSTRAINT "LevelMastery_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
