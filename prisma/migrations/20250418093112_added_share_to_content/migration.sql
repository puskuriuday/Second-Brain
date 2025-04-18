/*
  Warnings:

  - You are about to drop the `Share` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "share" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Share";
