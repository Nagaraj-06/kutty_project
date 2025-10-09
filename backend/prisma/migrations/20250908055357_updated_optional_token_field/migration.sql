/*
  Warnings:

  - Made the column `token` on table `reset_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `reset_tokens` MODIFY `token` VARCHAR(191) NOT NULL;
