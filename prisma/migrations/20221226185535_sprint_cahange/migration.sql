/*
  Warnings:

  - You are about to drop the `Backlog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sprintName]` on the table `Sprint` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Backlog" DROP CONSTRAINT "Backlog_boardId_fkey";

-- DropTable
DROP TABLE "Backlog";

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_sprintName_key" ON "Sprint"("sprintName");

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_sprintName_fkey" FOREIGN KEY ("sprintName") REFERENCES "Sprint"("sprintName") ON DELETE CASCADE ON UPDATE CASCADE;
