/*
  Warnings:

  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Board` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `sprintId` to the `Issues` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `boardId` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_boardId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP CONSTRAINT "Board_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Board_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "sprintId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "boardId",
ADD COLUMN     "boardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
