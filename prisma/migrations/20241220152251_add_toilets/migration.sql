/*
  Warnings:

  - Added the required column `toilets` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `property` ADD COLUMN `toilets` INTEGER NOT NULL;
