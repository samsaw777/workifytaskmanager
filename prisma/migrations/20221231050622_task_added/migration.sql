-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComments" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT,
    "userProfile" TEXT,
    "comment" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "TaskComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLabels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "TaskLabels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComments" ADD CONSTRAINT "TaskComments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLabels" ADD CONSTRAINT "TaskLabels_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
