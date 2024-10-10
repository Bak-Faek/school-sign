/*
  Warnings:

  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `learningcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `learningcategory` DROP FOREIGN KEY `LearningCategory_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_classId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_schoolId_fkey`;

-- DropTable
DROP TABLE `class`;

-- DropTable
DROP TABLE `learningcategory`;

-- DropTable
DROP TABLE `student`;

-- DropTable
DROP TABLE `teacher`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
