-- AlterTable
ALTER TABLE `sign` ADD COLUMN `lessonId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Sign` ADD CONSTRAINT `Sign_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
