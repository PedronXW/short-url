/*
  Warnings:

  - You are about to drop the column `active` on the `urls` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "urls" DROP COLUMN "active",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "active",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
