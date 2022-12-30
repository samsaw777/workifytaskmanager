/*
  Warnings:

  - Added the required column `position` to the `Issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionPosition` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "sectionPosition" INTEGER NOT NULL;
