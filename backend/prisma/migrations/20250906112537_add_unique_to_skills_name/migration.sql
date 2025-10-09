/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `roles_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `skills_master` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `roles_master_name_key` ON `roles_master`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `skills_master_name_key` ON `skills_master`(`name`);
