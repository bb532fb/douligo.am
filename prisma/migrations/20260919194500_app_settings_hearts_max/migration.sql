-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heartsMax" INTEGER NOT NULL DEFAULT 5,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- Seed
INSERT INTO "AppSettings" ("id", "heartsMax", "updatedAt")
VALUES ('default', 5, CURRENT_TIMESTAMP);
