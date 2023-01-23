-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedTo" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
