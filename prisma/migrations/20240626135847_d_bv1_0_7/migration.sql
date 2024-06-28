-- CreateTable
CREATE TABLE "AdminForgotPassword" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "AdminForgotPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminWhatsappVerification" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "AdminWhatsappVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminForgotPassword_adminId_key" ON "AdminForgotPassword"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminForgotPassword_adminId_token_key" ON "AdminForgotPassword"("adminId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "AdminWhatsappVerification_adminId_key" ON "AdminWhatsappVerification"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminWhatsappVerification_adminId_token_key" ON "AdminWhatsappVerification"("adminId", "token");

-- AddForeignKey
ALTER TABLE "AdminForgotPassword" ADD CONSTRAINT "AdminForgotPassword_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWhatsappVerification" ADD CONSTRAINT "AdminWhatsappVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
