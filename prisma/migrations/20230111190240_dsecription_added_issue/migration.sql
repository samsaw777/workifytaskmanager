/*
  Warnings:

  - Added the required column `description` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "IssueComments" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "userProfile" TEXT,
    "comment" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,

    CONSTRAINT "IssueComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueLabels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,

    CONSTRAINT "IssueLabels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueComments" ADD CONSTRAINT "IssueComments_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueLabels" ADD CONSTRAINT "IssueLabels_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
