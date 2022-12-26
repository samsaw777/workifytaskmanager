/*
  Warnings:

  - Added the required column `isUnderStartSprint` to the `Issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isUnderStartSprint` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "isUnderStartSprint" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "isUnderStartSprint" BOOLEAN NOT NULL;
