/*
  Warnings:

  - You are about to drop the column `answerProvideded` on the `InterviewTheoryAnswers` table. All the data in the column will be lost.
  - Added the required column `answer` to the `InterviewTheoryAnswers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewTheoryAnswers" DROP COLUMN "answerProvideded",
ADD COLUMN     "answer" TEXT NOT NULL;
