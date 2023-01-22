/*
  Warnings:

  - You are about to drop the `AssignedTo` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `assignedTo` on table `Issues` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AssignedTo" DROP CONSTRAINT "AssignedTo_userId_fkey";

-- DropForeignKey
ALTER TABLE "Issues" DROP CONSTRAINT "Issues_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Issues" ALTER COLUMN "assignedTo" SET NOT NULL,
ALTER COLUMN "assignedTo" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "AssignedTo";

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
