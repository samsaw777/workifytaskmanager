/*
  Warnings:

  - Added the required column `assignedTo` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "assignedTo" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AssignedTo" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AssignedTo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "AssignedTo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTo" ADD CONSTRAINT "AssignedTo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
