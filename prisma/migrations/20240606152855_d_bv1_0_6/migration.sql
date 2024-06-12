/*
  Warnings:

  - You are about to drop the column `adminId` on the `InstructorApproval` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstructorApproval" DROP CONSTRAINT "InstructorApproval_adminId_fkey";

-- AlterTable
ALTER TABLE "InstructorApproval" DROP COLUMN "adminId";
