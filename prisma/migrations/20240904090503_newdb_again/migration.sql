/*
  Warnings:

  - You are about to drop the column `email` on the `school` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `school` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `School_email_key` ON `school`;

-- AlterTable
ALTER TABLE `school` DROP COLUMN `email`,
    DROP COLUMN `password`;
