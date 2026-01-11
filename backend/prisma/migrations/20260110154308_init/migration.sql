-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('OFFERING', 'WANTED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "UserSkillStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "roles_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "profile_pic_url" TEXT,
    "profile_visibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "role_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_availability" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "from_time" TIMESTAMP(3) NOT NULL,
    "to_time" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "token_expiry" TIMESTAMP(3),
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "skill_type" "SkillType" NOT NULL,
    "status" "UserSkillStatus" NOT NULL DEFAULT 'INACTIVE',
    "average_rating" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_swaps" (
    "id" TEXT NOT NULL,
    "request_from" TEXT NOT NULL,
    "request_to" TEXT NOT NULL,
    "offer_user_skill_id" TEXT NOT NULL,
    "want_user_skill_id" TEXT NOT NULL,
    "message" TEXT,
    "scheduled" TIMESTAMP(3),
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "completed_by_from" BOOLEAN NOT NULL DEFAULT false,
    "completed_by_to" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "skill_swaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "skill_swap_id" TEXT NOT NULL,
    "given_by" TEXT NOT NULL,
    "received_by" TEXT NOT NULL,
    "feedback_text" TEXT,
    "rating" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments_master" (
    "id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "title" TEXT,
    "pass_mark" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_assessment_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "score" INTEGER,
    "status" TEXT,
    "attempted_at" TIMESTAMP(3),

    CONSTRAINT "user_assessment_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "skill_swap_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "is_archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "chat_session_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT,
    "file_url" TEXT,
    "send_at" TIMESTAMP(3),

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_master_name_key" ON "roles_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_availability_user_id_day_of_week_from_time_to_time_key" ON "user_availability"("user_id", "day_of_week", "from_time", "to_time");

-- CreateIndex
CREATE UNIQUE INDEX "reset_tokens_token_key" ON "reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "skills_master_name_key" ON "skills_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_skills_user_id_skill_id_key" ON "user_skills"("user_id", "skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_swaps_offer_user_skill_id_want_user_skill_id_request__key" ON "skill_swaps"("offer_user_skill_id", "want_user_skill_id", "request_from", "request_to");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_availability" ADD CONSTRAINT "user_availability_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_swaps" ADD CONSTRAINT "skill_swaps_offer_skill_id_fkey" FOREIGN KEY ("offer_user_skill_id") REFERENCES "user_skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_swaps" ADD CONSTRAINT "skill_swaps_request_from_fkey" FOREIGN KEY ("request_from") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_swaps" ADD CONSTRAINT "skill_swaps_request_to_fkey" FOREIGN KEY ("request_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_swaps" ADD CONSTRAINT "skill_swaps_want_skill_id_fkey" FOREIGN KEY ("want_user_skill_id") REFERENCES "user_skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_given_by_fkey" FOREIGN KEY ("given_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_skill_swap_id_fkey" FOREIGN KEY ("skill_swap_id") REFERENCES "skill_swaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments_master" ADD CONSTRAINT "assessments_master_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_assessment_attempts" ADD CONSTRAINT "user_assessment_attempts_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_assessment_attempts" ADD CONSTRAINT "user_assessment_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_skill_swap_id_fkey" FOREIGN KEY ("skill_swap_id") REFERENCES "skill_swaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_session_id_fkey" FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
