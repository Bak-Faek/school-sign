/*
  Warnings:

  - You are about to drop the column `classname` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_classname_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `classname`,
    ADD COLUMN `className` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_className_fkey` FOREIGN KEY (`className`) REFERENCES `Classsection`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
