/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `username`,
    ADD COLUMN `user_name` VARCHAR(30) NULL;
