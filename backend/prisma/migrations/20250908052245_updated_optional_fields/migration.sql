/*
  Warnings:

  - Made the column `name` on table `roles_master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `skills_master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `roles_master` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `skills_master` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `user_name` VARCHAR(30) NOT NULL;
