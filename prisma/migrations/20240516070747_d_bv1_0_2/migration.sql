/*
  Warnings:

  - You are about to drop the column `expiry` on the `ForgotPassword` table. All the data in the column will be lost.
  - You are about to drop the column `expiry` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `UserVerification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ForgotPassword" DROP COLUMN "expiry";

-- AlterTable
ALTER TABLE "UserVerification" DROP COLUMN "expiry",
DROP COLUMN "verified";
