-- CreateTable
CREATE TABLE "UserWhatsappVerification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "UserWhatsappVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWhatsappVerification_userId_key" ON "UserWhatsappVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWhatsappVerification_userId_token_key" ON "UserWhatsappVerification"("userId", "token");

-- AddForeignKey
ALTER TABLE "UserWhatsappVerification" ADD CONSTRAINT "UserWhatsappVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
