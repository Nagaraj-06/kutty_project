const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create a swap request
async function createSwapRequest(user_id, data) {
  // Prevent self-request
  if (data.request_from === data.request_to) {
    const err = new Error("You cannot send a swap request to yourself.");
    err.statusCode = 400;
    throw err;
  }

  return await prisma.skill_swaps.create({
    data: {
      request_from: user_id,
      request_to: data.request_to,
      offer_skill_id: data.offer_skill_id,
      want_skill_id: data.want_skill_id,
      message: data.message,
      scheduled: data.scheduled || null,
      status: "PENDING",
      created_by: user_id,
    },
  });
}

// Update request status (ACCEPTED/REJECTED/CANCELLED)

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
async function getUserRequests(userId) {
  return await prisma.skill_swaps.findMany({
    where: {
      OR: [{ request_from: userId }, { request_to: userId }],
      is_active: true,
    },
    select: {
      id: true,
      created_at: true,
      is_active: true,
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
          skill_type: true,
          status: true,
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
          skill_type: true,
          status: true,
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

module.exports = {
  createSwapRequest,
  updateSwapStatus,
  getUserRequests,
};
