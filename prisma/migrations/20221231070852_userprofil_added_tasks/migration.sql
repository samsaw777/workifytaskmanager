/*
  Warnings:

  - Added the required column `profile` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "profile" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
