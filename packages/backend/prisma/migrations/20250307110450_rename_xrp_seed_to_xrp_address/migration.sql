/*
  Warnings:

  - You are about to drop the column `xrp_seed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "xrp_seed",
ADD COLUMN     "xrp_address" TEXT;
