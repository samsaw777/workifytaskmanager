/*
  Warnings:

  - You are about to drop the column `email` on the `Members` table. All the data in the column will be lost.
  - Added the required column `username` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Members" DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL;
