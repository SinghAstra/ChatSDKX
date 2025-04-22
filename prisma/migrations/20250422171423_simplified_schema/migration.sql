/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Suggestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_documentId_documentCreatedAt_fkey";

-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_messageId_fkey";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Suggestion";

-- DropTable
DROP TABLE "Vote";

-- DropEnum
DROP TYPE "DocumentKind";
