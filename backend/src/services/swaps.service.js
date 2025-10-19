const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create a swap request
async function createSwapRequest(user_id, data) {
  const { request_to, offer_user_skill_id, want_user_skill_id, message } = data;

  // Prevent self-request
  if (user_id === request_to) {
    const err = new Error("You cannot send a swap request to yourself.");
    err.statusCode = 400;
    throw err;
  }

  // 1️⃣ Fetch current user offering/wanting
  const userOffer = await prisma.user_skills.findUnique({
    where: { id: offer_user_skill_id, user_id: user_id, is_active: true },
  });
  const userWant = await prisma.user_skills.findUnique({
    where: { id: want_user_skill_id, user_id: user_id, is_active: true },
  });

  // console.log(userOffer+" "+userWant);

  // 2️⃣ Fetch requested user's skills
  const targetOffer = await prisma.user_skills.findFirst({
    where: {
      user_id: request_to,
      skill_id: userWant.skill_id,
      skill_type: "OFFERING",
      is_active: true,
    },
  });

  const targetWant = await prisma.user_skills.findFirst({
    where: {
      user_id: request_to,
      skill_id: userOffer.skill_id,
      skill_type: "WANTED",
      is_active: true,
    },
  });

  if (!targetOffer || !targetWant) {
    throw new Error("Mutual skills do not match. Swap cannot be created.");
  }

  await prisma.skill_swaps.create({
    data: {
      request_from: user_id,
      request_to: request_to,
      offer_user_skill_id: offer_user_skill_id,
      want_user_skill_id: want_user_skill_id,
      message: message,
      scheduled: data.scheduled || null,
      created_by: user_id,
    },
  });
}

// Update request status (ACCEPTED/REJECTED)

async function updateSwapStatus(id, status) {
  const swap = await prisma.skill_swaps.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      status: true,
      request_from: true,
      request_to: true,
    },
  });

  // Create chat session only if accepted
  if (status === "ACCEPTED") {
    const existingSession = await prisma.chat_sessions.findFirst({
      where: { skill_swap_id: id },
    });

    // Avoid duplicate sessions
    if (!existingSession) {
      await prisma.chat_sessions.create({
        data: {
          skill_swap_id: id,
          started_at: new Date(),
          is_active: true,
        },
      });
    }
  }

  return swap;
}

/**
 * Get all requests for a user
 */
async function getUserRequests(user_id) {
  return await prisma.skill_swaps.findMany({
    where: {
      OR: [{ request_from: user_id }, { request_to: user_id }],
      is_active: true,
    },
    select: {
      id: true,
      status: true,
      requestFrom: {
        select: { id: true, email: true },
      },
      requestTo: {
        select: { id: true, email: true },
      },
      offerSkill: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              email: true,
              user_name: true,
            },
          },
          skill_type: true,
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      wantSkill: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              email: true,
              user_name: true,
            },
          },
          skill_type: true,
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
}

async function markSkillSwapComplete(user_id, skill_swap_id) {
  const swap = await prisma.skill_swaps.findUnique({
    where: { id: skill_swap_id },
  });

  if (!swap) {
    const err = new Error("Skill swap not found");
    err.statusCode = 404;
    throw err;
  }

  if (swap.status !== "ACCEPTED") {
    const err = new Error("Skill swap is not in an active state");
    err.statusCode = 400;
    throw err;
  }

  const updateData = { updated_by: user_id };

  if (swap.request_from === user_id) updateData.completed_by_from = true;
  else if (swap.request_to === user_id) updateData.completed_by_to = true;
  else {
    const err = new Error("You are not a participant in this swap");
    err.statusCode = 403;
    throw err;
  }

  const updatedSwap = await prisma.skill_swaps.update({
    where: { id: skill_swap_id },
    data: updateData,
  });

  // If both users marked completed → mark status COMPLETED
  if (updatedSwap.completed_by_from && updatedSwap.completed_by_to) {
    const finalSwap = await prisma.skill_swaps.update({
      where: { id: skill_swap_id },
      data: { status: "COMPLETED", updated_by: user_id },
      select: {
        id: true,
        status: true,
        completed_by_from: true,
        completed_by_to: true,
      },
    });

    // Optionally archive related chat session
    await prisma.chat_sessions.updateMany({
      where: { skill_swap_id },
      data: { is_archived: true },
    });

    return finalSwap;
  }

  return updatedSwap;
}

module.exports = {
  createSwapRequest,
  updateSwapStatus,
  getUserRequests,
  markSkillSwapComplete,
};
