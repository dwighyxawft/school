/*
  Warnings:

  - You are about to drop the column `instructr_id` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `instructor_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_instructr_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "instructr_id",
ADD COLUMN     "instructor_id" INTEGER NOT NULL,
ADD COLUMN     "purpose" TEXT DEFAULT 'Course payment',
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
