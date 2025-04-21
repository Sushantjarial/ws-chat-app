/*
  Warnings:

  - A unique constraint covering the columns `[roomToken]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomToken` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomToken_key" ON "Room"("roomToken");
