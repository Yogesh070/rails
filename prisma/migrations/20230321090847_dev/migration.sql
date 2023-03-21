-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "flagged" SET DEFAULT false;
