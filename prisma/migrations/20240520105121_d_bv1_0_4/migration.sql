-- AlterTable
ALTER TABLE "ForgotPassword" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserVerification" ALTER COLUMN "updatedAt" DROP DEFAULT;
