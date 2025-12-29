/*
  Warnings:

  - You are about to drop the column `acccess_token` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "acccess_token",
ADD COLUMN     "access_token" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3);
