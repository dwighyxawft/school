/*
  Warnings:

  - You are about to drop the column `adminVerificationId` on the `Admin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_adminVerificationId_fkey";

-- DropForeignKey
ALTER TABLE "AdminVerification" DROP CONSTRAINT "AdminVerification_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "adminVerificationId";

-- AddForeignKey
ALTER TABLE "AdminVerification" ADD CONSTRAINT "AdminVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
