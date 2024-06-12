/*
  Warnings:

  - You are about to drop the column `interviewLink` on the `InstructorApproval` table. All the data in the column will be lost.
  - You are about to drop the column `tiktokLink` on the `InstructorApproval` table. All the data in the column will be lost.
  - You are about to drop the column `websiteLink` on the `InstructorApproval` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeLink` on the `InstructorApproval` table. All the data in the column will be lost.
  - Added the required column `website` to the `InstructorApproval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `youtube` to the `InstructorApproval` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstructorApproval" DROP COLUMN "interviewLink",
DROP COLUMN "tiktokLink",
DROP COLUMN "websiteLink",
DROP COLUMN "youtubeLink",
ADD COLUMN     "interview" TEXT,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "website" TEXT NOT NULL,
ADD COLUMN     "youtube" TEXT NOT NULL;
