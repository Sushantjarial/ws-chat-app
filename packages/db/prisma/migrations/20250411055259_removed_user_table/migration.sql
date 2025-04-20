/*
  Warnings:

  - You are about to drop the column `ownerToken` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `senderId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";

-- DropIndex
DROP INDEX "Room_ownerToken_key";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "senderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "ownerToken",
DROP COLUMN "userName";

-- DropTable
DROP TABLE "User";
