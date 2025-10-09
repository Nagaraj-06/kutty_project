/*
  Warnings:

  - You are about to alter the column `day_of_week` on the `user_availability` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Enum(EnumId(1))`.
  - You are about to alter the column `profile_visibility` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `user_availability` MODIFY `day_of_week` ENUM('MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT', 'SUN') NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deleted_by` CHAR(36) NULL,
    MODIFY `profile_visibility` ENUM('PUBLIC', 'PRIVATE') NULL DEFAULT 'PUBLIC';
