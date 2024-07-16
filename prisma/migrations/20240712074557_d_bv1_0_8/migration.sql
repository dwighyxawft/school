/*
  Warnings:

  - Changed the type of `day` on the `Timetable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Days" AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- AlterTable
ALTER TABLE "Timetable" ALTER COLUMN "start" SET DATA TYPE TEXT,
ALTER COLUMN "end" SET DATA TYPE TEXT,
DROP COLUMN "day",
ADD COLUMN     "day" "Days" NOT NULL;
