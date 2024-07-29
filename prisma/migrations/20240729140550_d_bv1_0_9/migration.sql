/*
  Warnings:

  - A unique constraint covering the columns `[questionId]` on the table `InterviewObjectiveAnswers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId]` on the table `InterviewTheoryAnswers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InterviewObjectiveAnswers_questionId_key" ON "InterviewObjectiveAnswers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewTheoryAnswers_questionId_key" ON "InterviewTheoryAnswers"("questionId");
