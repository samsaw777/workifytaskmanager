/*
  Warnings:

  - Added the required column `projectId` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "projectId" INTEGER NOT NULL;
