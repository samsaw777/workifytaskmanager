/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Project` table. All the data in the column will be lost.
  - Added the required column `isBug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isScrum` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iskanban` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "userEmail",
ADD COLUMN     "isBug" BOOLEAN NOT NULL,
ADD COLUMN     "isScrum" BOOLEAN NOT NULL,
ADD COLUMN     "iskanban" BOOLEAN NOT NULL;
