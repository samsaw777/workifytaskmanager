/*
  Warnings:

  - Added the required column `userId` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Members" ADD COLUMN     "userId" TEXT NOT NULL;
