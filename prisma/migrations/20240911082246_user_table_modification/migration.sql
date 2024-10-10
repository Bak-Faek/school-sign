/*
  Warnings:

  - You are about to drop the column `classId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Classsection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_classId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `classId`,
    ADD COLUMN `classname` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Classsection_name_key` ON `Classsection`(`name`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classname_fkey` FOREIGN KEY (`classname`) REFERENCES `Classsection`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
