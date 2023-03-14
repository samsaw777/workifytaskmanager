/*
  Warnings:

  - Added the required column `projectId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "projectId" INTEGER NOT NULL;
