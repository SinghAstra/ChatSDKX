/*
  Warnings:

  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'model');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "content" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
