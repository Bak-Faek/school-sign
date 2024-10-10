/*
  Warnings:

  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_classId_fkey`;

-- DropTable
DROP TABLE `class`;

-- CreateTable
CREATE TABLE `Classsection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `schoolId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classsection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classsection` ADD CONSTRAINT `Classsection_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
