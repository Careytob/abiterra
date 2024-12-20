/*
  Warnings:

  - You are about to alter the column `type` on the `property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `agentId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bq` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `property` ADD COLUMN `agentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `area` DOUBLE NOT NULL,
    ADD COLUMN `bathrooms` INTEGER NOT NULL,
    ADD COLUMN `bedrooms` INTEGER NOT NULL,
    ADD COLUMN `bq` INTEGER NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('AVAILABLE', 'PENDING', 'SOLD', 'RENTED') NOT NULL DEFAULT 'AVAILABLE',
    MODIFY `type` ENUM('SALE', 'RENT') NOT NULL;

-- CreateTable
CREATE TABLE `Feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `propertyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feature` ADD CONSTRAINT `Feature_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
