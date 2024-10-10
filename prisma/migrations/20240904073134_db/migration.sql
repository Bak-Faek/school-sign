-- DropForeignKey
ALTER TABLE `school` DROP FOREIGN KEY `School_typeId_fkey`;

-- AlterTable
ALTER TABLE `school` MODIFY `typeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `firstname` VARCHAR(100) NULL,
    MODIFY `lastname` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
