/*
  Warnings:

  - Added the required column `gender` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PersonnelType" AS ENUM ('USER', 'INSTRUCTOR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "InstructorApproval" DROP CONSTRAINT "InstructorApproval_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "InstructorApproval" ALTER COLUMN "adminId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "personnelId" INTEGER NOT NULL,
    "personnelType" "PersonnelType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "instructorId" INTEGER,
    "adminId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_personnelId_personnelType_idx" ON "Notification"("personnelId", "personnelType");

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorApproval" ADD CONSTRAINT "InstructorApproval_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
