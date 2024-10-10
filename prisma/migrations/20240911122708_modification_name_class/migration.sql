/*
  Warnings:

  - You are about to drop the column `className` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_className_fkey`;

-- DropIndex
DROP INDEX `Classsection_name_key` ON `classsection`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `className`,
    ADD COLUMN `classId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classsection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
