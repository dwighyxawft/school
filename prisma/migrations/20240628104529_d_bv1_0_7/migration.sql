/*
  Warnings:

  - Added the required column `instructr_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "instructr_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_instructr_id_fkey" FOREIGN KEY ("instructr_id") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
