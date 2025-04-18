/*
  Warnings:

  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "tags";

-- CreateTable
CREATE TABLE "Share" (
    "id" SERIAL NOT NULL,
    "share" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);
