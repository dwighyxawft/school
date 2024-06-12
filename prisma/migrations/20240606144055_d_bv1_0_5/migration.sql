-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "phoned" BOOLEAN DEFAULT false,
ADD COLUMN     "verified" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "phoned" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoned" BOOLEAN DEFAULT false;
