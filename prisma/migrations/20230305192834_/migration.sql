-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "request" BOOLEAN NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
