-- CreateTable
CREATE TABLE "Issues" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profile" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
