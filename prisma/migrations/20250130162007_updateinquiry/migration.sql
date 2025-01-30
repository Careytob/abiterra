/*
  Warnings:

  - Added the required column `phone` to the `inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inquiry" ADD COLUMN     "phone" TEXT NOT NULL;
