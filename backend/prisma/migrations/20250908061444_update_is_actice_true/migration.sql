/*
  Warnings:

  - Made the column `role_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_role_id_fkey`;

-- DropIndex
DROP INDEX `users_role_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `assessments_master` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `chat_sessions` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `feedbacks` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `roles_master` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `skill_swaps` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `skills_master` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `user_availability` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `user_skills` MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` MODIFY `role_id` VARCHAR(191) NOT NULL,
    MODIFY `is_active` BOOLEAN NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
