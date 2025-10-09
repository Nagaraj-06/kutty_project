-- CreateTable
CREATE TABLE `roles_master` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NULL,
    `username` VARCHAR(30) NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NULL,
    `profile_pic_url` VARCHAR(191) NULL,
    `profile_visibility` VARCHAR(20) NULL,
    `role_id` VARCHAR(191) NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_availability` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `day_of_week` VARCHAR(10) NULL,
    `from_time` DATETIME(3) NULL,
    `to_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reset_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `token_expiry` DATETIME(3) NULL,
    `used` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills_master` (
    `id` VARCHAR(191) NOT NULL,
    `skill_name` VARCHAR(100) NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_skills` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `skill_id` VARCHAR(191) NOT NULL,
    `skill_type` VARCHAR(20) NULL,
    `status` VARCHAR(20) NULL,
    `average_rating` DOUBLE NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skill_swaps` (
    `id` VARCHAR(191) NOT NULL,
    `request_from` VARCHAR(191) NOT NULL,
    `request_to` VARCHAR(191) NOT NULL,
    `offer_skill_id` VARCHAR(191) NOT NULL,
    `want_skill_id` VARCHAR(191) NOT NULL,
    `scheduled` DATETIME(3) NULL,
    `status` VARCHAR(20) NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbacks` (
    `id` VARCHAR(191) NOT NULL,
    `skill_swap_id` VARCHAR(191) NOT NULL,
    `given_by` VARCHAR(191) NOT NULL,
    `received_by` VARCHAR(191) NOT NULL,
    `feedback_text` VARCHAR(191) NULL,
    `rating` DOUBLE NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessments_master` (
    `id` VARCHAR(191) NOT NULL,
    `skill_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `pass_mark` INTEGER NULL,
    `is_active` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_assessment_attempts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `assessment_id` VARCHAR(191) NOT NULL,
    `score` INTEGER NULL,
    `status` VARCHAR(20) NULL,
    `attempted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `skill_swap_id` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NULL,
    `started_at` DATETIME(3) NULL,
    `ended_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` VARCHAR(191) NOT NULL,
    `chat_session_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `file_url` VARCHAR(191) NULL,
    `send_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles_master`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_availability` ADD CONSTRAINT `user_availability_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reset_tokens` ADD CONSTRAINT `reset_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_skills` ADD CONSTRAINT `user_skills_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_skills` ADD CONSTRAINT `user_skills_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_swaps` ADD CONSTRAINT `skill_swaps_request_from_fkey` FOREIGN KEY (`request_from`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_swaps` ADD CONSTRAINT `skill_swaps_request_to_fkey` FOREIGN KEY (`request_to`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_swaps` ADD CONSTRAINT `skill_swaps_offer_skill_id_fkey` FOREIGN KEY (`offer_skill_id`) REFERENCES `user_skills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_swaps` ADD CONSTRAINT `skill_swaps_want_skill_id_fkey` FOREIGN KEY (`want_skill_id`) REFERENCES `user_skills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_skill_swap_id_fkey` FOREIGN KEY (`skill_swap_id`) REFERENCES `skill_swaps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_given_by_fkey` FOREIGN KEY (`given_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_received_by_fkey` FOREIGN KEY (`received_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments_master` ADD CONSTRAINT `assessments_master_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assessment_attempts` ADD CONSTRAINT `user_assessment_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assessment_attempts` ADD CONSTRAINT `user_assessment_attempts_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `assessments_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_skill_swap_id_fkey` FOREIGN KEY (`skill_swap_id`) REFERENCES `skill_swaps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_chat_session_id_fkey` FOREIGN KEY (`chat_session_id`) REFERENCES `chat_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
