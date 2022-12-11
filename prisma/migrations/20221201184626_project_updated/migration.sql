/*
  Warnings:

  - You are about to drop the column `iskanban` on the `Project` table. All the data in the column will be lost.
  - Added the required column `isKanban` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "iskanban",
ADD COLUMN     "isKanban" BOOLEAN NOT NULL;
