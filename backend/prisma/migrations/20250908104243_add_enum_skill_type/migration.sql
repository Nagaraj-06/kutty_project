/*
  Warnings:

  - Made the column `skill_type` on table `user_skills` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user_skills` MODIFY `skill_type` ENUM('OFFERING', 'WANTED') NOT NULL;
