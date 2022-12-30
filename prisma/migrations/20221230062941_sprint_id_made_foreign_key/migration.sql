-- DropForeignKey
ALTER TABLE "Issues" DROP CONSTRAINT "Issues_sprintName_fkey";

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
