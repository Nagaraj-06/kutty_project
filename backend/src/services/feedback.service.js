const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create feedback and update average_rating
async function createFeedback(data) {
  const {
    skill_swap_id,
    given_by,
    user_skill_id,
    received_by,
    feedback_text,
    rating,
  } = data;

  // 1️⃣ Create feedback
  await prisma.feedbacks.create({
    data: {
      skill_swap_id,
      given_by,
      received_by,
      feedback_text,
      rating,
      is_active: true,
      created_by: given_by,
    },
  });

  // 2️⃣ Calculate new average rating for received user's skill
  const avgRatingResult = await prisma.feedbacks.aggregate({
    where: {
      received_by,
      is_active: true,
      skill_swap: {
        // only consider feedbacks related to this skill
        offer_user_skill_id: user_skill_id,
      },
    },
    _avg: { rating: true },
  });

  const average_rating = avgRatingResult._avg.rating || null;

  // 3️⃣ Update user_skills table
  await prisma.user_skills.update({
    where: {
      id: user_skill_id,
    },
    data: { average_rating },
  });
}

// Get feedbacks received by a user
async function getFeedbacksForUser(user_id) {
  return await prisma.feedbacks.findMany({
    where: {
      received_by: user_id,
      is_active: true,
    },
    select: {
      id: true,
      skill_swap_id: true,
      feedback_text: true,
      rating: true,
      created_at: true,
      givenBy: {
        select: {
          id: true,
          email: true,
          user_name: true,
          profile_pic_url: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
}

module.exports = { createFeedback, getFeedbacksForUser };
