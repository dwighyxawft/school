-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "access" SET DEFAULT false;
