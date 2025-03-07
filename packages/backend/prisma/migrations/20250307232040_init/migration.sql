/*
  Warnings:

  - You are about to drop the column `xrp_address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `xrp_publicKey` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `xrp_signature` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "xrp_address",
DROP COLUMN "xrp_publicKey",
DROP COLUMN "xrp_signature";
