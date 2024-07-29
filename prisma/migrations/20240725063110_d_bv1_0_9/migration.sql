-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('OBJECTIVE', 'THEORY', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "InterviewPhase" AS ENUM ('TEST', 'VIDEO_CHAT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Interview" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "type" "InterviewType" NOT NULL,
    "phase" "InterviewPhase" NOT NULL,
    "status" "InterviewStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewObjectiveQuestion" (
    "id" SERIAL NOT NULL,
    "objectiveId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "correctOption" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewObjectiveQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewObjectiveOption" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "InterviewObjectiveOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectiveTest" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObjectiveTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewTheoryQuestion" (
    "id" SERIAL NOT NULL,
    "theoryId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewTheoryQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheoryTest" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "questions" TEXT NOT NULL,
    "submission" TEXT,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,

    CONSTRAINT "TheoryTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticalTest" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "projectDetails" TEXT NOT NULL,
    "submission" TEXT,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,

    CONSTRAINT "PracticalTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interview_instructorId_key" ON "Interview"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewObjectiveQuestion_objectiveId_key" ON "InterviewObjectiveQuestion"("objectiveId");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectiveTest_interviewId_key" ON "ObjectiveTest"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewTheoryQuestion_theoryId_key" ON "InterviewTheoryQuestion"("theoryId");

-- CreateIndex
CREATE UNIQUE INDEX "TheoryTest_interviewId_key" ON "TheoryTest"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticalTest_interviewId_key" ON "PracticalTest"("interviewId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewObjectiveQuestion" ADD CONSTRAINT "InterviewObjectiveQuestion_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "ObjectiveTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewObjectiveOption" ADD CONSTRAINT "InterviewObjectiveOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewObjectiveQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectiveTest" ADD CONSTRAINT "ObjectiveTest_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTheoryQuestion" ADD CONSTRAINT "InterviewTheoryQuestion_theoryId_fkey" FOREIGN KEY ("theoryId") REFERENCES "TheoryTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryTest" ADD CONSTRAINT "TheoryTest_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticalTest" ADD CONSTRAINT "PracticalTest_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
