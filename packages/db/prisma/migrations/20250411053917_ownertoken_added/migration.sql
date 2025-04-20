/*
  Warnings:

  - A unique constraint covering the columns `[ownerToken]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerToken` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "senderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "ownerToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_ownerToken_key" ON "Room"("ownerToken");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
