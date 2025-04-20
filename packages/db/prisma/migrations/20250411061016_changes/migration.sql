/*
  Warnings:

  - Made the column `adminId` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "adminId" SET NOT NULL;
