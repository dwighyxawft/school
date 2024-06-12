-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "adminVerificationId" INTEGER;

-- CreateTable
CREATE TABLE "AdminVerification" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "AdminVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminVerification_adminId_key" ON "AdminVerification"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminVerification_adminId_token_key" ON "AdminVerification"("adminId", "token");

-- AddForeignKey
ALTER TABLE "AdminVerification" ADD CONSTRAINT "AdminVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_adminVerificationId_fkey" FOREIGN KEY ("adminVerificationId") REFERENCES "AdminVerification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
