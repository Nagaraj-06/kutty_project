/*
  Warnings:

  - Made the column `status` on table `skill_swaps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `user_skills` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `skill_swaps` ADD COLUMN `message` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `user_skills` MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL;
