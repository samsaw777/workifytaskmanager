/*
  Warnings:

  - Added the required column `createdAt` to the `Issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endAt" TIMESTAMP(3);
