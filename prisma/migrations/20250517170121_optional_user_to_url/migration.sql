-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_userId_fkey";

-- AlterTable
ALTER TABLE "urls" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
