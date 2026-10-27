-- CreateEnum
CREATE TYPE "ArticleAudioStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "ArticleAudio" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "voice" TEXT NOT NULL,
    "status" "ArticleAudioStatus" NOT NULL DEFAULT 'PENDING',
    "storageKey" TEXT,
    "contentType" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleAudio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleAudio_articleId_contentHash_key" ON "ArticleAudio"("articleId", "contentHash");
