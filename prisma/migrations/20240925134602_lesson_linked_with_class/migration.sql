-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `classId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classsection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
