-- DropForeignKey
ALTER TABLE `inquiry` DROP FOREIGN KEY `Inquiry_propertyId_fkey`;

-- AddForeignKey
ALTER TABLE `Inquiry` ADD CONSTRAINT `Inquiry_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
