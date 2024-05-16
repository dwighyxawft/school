/*
  Warnings:

  - A unique constraint covering the columns `[userId,token]` on the table `UserVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_userId_token_key" ON "UserVerification"("userId", "token");
