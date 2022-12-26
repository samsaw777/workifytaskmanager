/*
  Warnings:

  - Added the required column `backlogName` to the `Backlog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Backlog" ADD COLUMN     "backlogName" TEXT NOT NULL;
