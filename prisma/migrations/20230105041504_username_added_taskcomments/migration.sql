/*
  Warnings:

  - You are about to drop the column `userEmail` on the `TaskComments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TaskComments" DROP COLUMN "userEmail",
ADD COLUMN     "username" TEXT;
