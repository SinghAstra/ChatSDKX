/*
  Warnings:

  - You are about to drop the column `visibility` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `parts` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "visibility",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "parts",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "Visibility";
