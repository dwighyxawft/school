-- AlterTable
ALTER TABLE "ForgotPassword" ADD COLUMN     "expiredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserVerification" ADD COLUMN     "expiredAt" TIMESTAMP(3);
