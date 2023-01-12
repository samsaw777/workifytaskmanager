/*
  Warnings:

  - You are about to drop the column `issue` on the `Issues` table. All the data in the column will be lost.
  - Added the required column `title` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" DROP COLUMN "issue",
ADD COLUMN     "title" TEXT NOT NULL;
