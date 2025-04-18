/*
  Warnings:

  - You are about to drop the column `share` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "share";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "share" BOOLEAN NOT NULL DEFAULT false;
