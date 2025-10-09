/*
  Warnings:

  - A unique constraint covering the columns `[user_id,day_of_week,from_time,to_time]` on the table `user_availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_availability_user_id_day_of_week_from_time_to_time_key` ON `user_availability`(`user_id`, `day_of_week`, `from_time`, `to_time`);
