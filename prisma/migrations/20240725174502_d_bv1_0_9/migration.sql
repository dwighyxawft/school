/*
  Warnings:

  - The values [TEST,VIDEO_CHAT,COMPLETED] on the enum `InterviewPhase` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,COMPLETED,FAILED] on the enum `InterviewStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [OBJECTIVE,THEORY,PRACTICAL] on the enum `InterviewType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewPhase_new" AS ENUM ('Test', 'Video_Chat', 'Completed');
ALTER TABLE "Interview" ALTER COLUMN "phase" TYPE "InterviewPhase_new" USING ("phase"::text::"InterviewPhase_new");
ALTER TYPE "InterviewPhase" RENAME TO "InterviewPhase_old";
ALTER TYPE "InterviewPhase_new" RENAME TO "InterviewPhase";
DROP TYPE "InterviewPhase_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InterviewStatus_new" AS ENUM ('Pending', 'In_Progress', 'Completed', 'Failed');
ALTER TABLE "Interview" ALTER COLUMN "status" TYPE "InterviewStatus_new" USING ("status"::text::"InterviewStatus_new");
ALTER TYPE "InterviewStatus" RENAME TO "InterviewStatus_old";
ALTER TYPE "InterviewStatus_new" RENAME TO "InterviewStatus";
DROP TYPE "InterviewStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InterviewType_new" AS ENUM ('Objective', 'Theory', 'Practical');
ALTER TABLE "Interview" ALTER COLUMN "type" TYPE "InterviewType_new" USING ("type"::text::"InterviewType_new");
ALTER TYPE "InterviewType" RENAME TO "InterviewType_old";
ALTER TYPE "InterviewType_new" RENAME TO "InterviewType";
DROP TYPE "InterviewType_old";
COMMIT;
