-- CreateTable
CREATE TABLE "InterviewObjectiveAnswers" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "optionPicked" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewObjectiveAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewTheoryAnswers" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "answerProvideded" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewTheoryAnswers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewObjectiveAnswers" ADD CONSTRAINT "InterviewObjectiveAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewObjectiveQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewObjectiveAnswers" ADD CONSTRAINT "InterviewObjectiveAnswers_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTheoryAnswers" ADD CONSTRAINT "InterviewTheoryAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewTheoryQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTheoryAnswers" ADD CONSTRAINT "InterviewTheoryAnswers_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
