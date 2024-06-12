-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InstructorApproval" (
    "id" SERIAL NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "certificate" TEXT NOT NULL,
    "youtubeLink" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "tiktokLink" TEXT,
    "interviewLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructorApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorVerification" (
    "id" SERIAL NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "InstructorVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstructorApproval_instructorId_key" ON "InstructorApproval"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "InstructorVerification_instructorId_key" ON "InstructorVerification"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "InstructorVerification_instructorId_token_key" ON "InstructorVerification"("instructorId", "token");

-- AddForeignKey
ALTER TABLE "InstructorApproval" ADD CONSTRAINT "InstructorApproval_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorVerification" ADD CONSTRAINT "InstructorVerification_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
