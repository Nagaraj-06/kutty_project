/*
  Warnings:

  - You are about to drop the column `skill_name` on the `skills_master` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `skills_master` DROP COLUMN `skill_name`,
    ADD COLUMN `name` VARCHAR(100) NULL;
