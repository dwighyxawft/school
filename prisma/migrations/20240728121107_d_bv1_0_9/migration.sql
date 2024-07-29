/*
  Warnings:

  - The values [Practical] on the enum `InterviewType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `PracticalTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewType_new" AS ENUM ('Objective', 'Theory');
ALTER TABLE "Interview" ALTER COLUMN "type" TYPE "InterviewType_new" USING ("type"::text::"InterviewType_new");
ALTER TYPE "InterviewType" RENAME TO "InterviewType_old";
ALTER TYPE "InterviewType_new" RENAME TO "InterviewType";
DROP TYPE "InterviewType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "PracticalTest" DROP CONSTRAINT "PracticalTest_interviewId_fkey";

-- DropTable
DROP TABLE "PracticalTest";
