-- CreateTable
CREATE TABLE "InstructorWhatsappVerification" (
    "id" SERIAL NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "InstructorWhatsappVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstructorWhatsappVerification_instructorId_key" ON "InstructorWhatsappVerification"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "InstructorWhatsappVerification_instructorId_token_key" ON "InstructorWhatsappVerification"("instructorId", "token");

-- AddForeignKey
ALTER TABLE "InstructorWhatsappVerification" ADD CONSTRAINT "InstructorWhatsappVerification_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
