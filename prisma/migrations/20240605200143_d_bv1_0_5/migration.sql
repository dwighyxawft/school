-- CreateTable
CREATE TABLE "InstructForgotPassword" (
    "id" SERIAL NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "InstructForgotPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstructForgotPassword_instructorId_key" ON "InstructForgotPassword"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "InstructForgotPassword_instructorId_token_key" ON "InstructForgotPassword"("instructorId", "token");

-- AddForeignKey
ALTER TABLE "InstructForgotPassword" ADD CONSTRAINT "InstructForgotPassword_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
