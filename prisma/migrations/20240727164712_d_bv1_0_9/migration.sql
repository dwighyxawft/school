/*
  Warnings:

  - You are about to drop the column `questions` on the `TheoryTest` table. All the data in the column will be lost.
  - You are about to drop the column `submission` on the `TheoryTest` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `TheoryTest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "InterviewTheoryQuestion_theoryId_key";

-- AlterTable
ALTER TABLE "TheoryTest" DROP COLUMN "questions",
DROP COLUMN "submission",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
