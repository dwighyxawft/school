/*
  Warnings:

  - A unique constraint covering the columns `[userId,token]` on the table `ForgotPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_userId_token_key" ON "ForgotPassword"("userId", "token");
