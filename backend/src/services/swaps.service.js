const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create a swap request
// Create a swap request
async function createSwapRequest(user_id, data) {
  const {
    request_to,
    offer_user_skill_id,
    want_user_skill_id,
    message,
    scheduled,
  } = data;

  // 0️⃣ Prevent self request
  if (user_id === request_to) {
    const err = new Error("You cannot send a swap request to yourself.");
    err.statusCode = 400;
    throw err;
  }

  // 1️⃣ Fetch current user's skills
  const userOffer = await prisma.user_skills.findFirst({
    where: {
      id: offer_user_skill_id,
      user_id: user_id,
      skill_type: "OFFERING",
      is_active: true,
    },
  });

  const userWant = await prisma.user_skills.findFirst({
    where: {
      id: want_user_skill_id,
      user_id: user_id,
      skill_type: "WANTED",
      is_active: true,
    },
  });

  if (!userOffer || !userWant) {
    const err = new Error("Invalid skills selected.");
    err.statusCode = 400;
    throw err;
  }

  // 2️⃣ Fetch target user's matching skills
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
    const err = new Error(
      "Mutual skills do not match. Swap cannot be created."
    );
    err.statusCode = 400;
    throw err;
  }


  // 3️⃣ Check for existing swap (both directions)
  const existingSwap = await prisma.skill_swaps.findFirst({
    where: {
      OR: [
        {
          request_from: user_id,
          request_to: request_to,
          offer_user_skill_id,
          want_user_skill_id,
        },
        // {
        //   request_from: request_to,
        //   request_to: user_id,
        //   offer_user_skill_id: want_user_skill_id,
        //   want_user_skill_id: offer_user_skill_id,
        // },
      ],
    },
  });


  if (existingSwap) {

    let errorMessage =
      "A swap request already exists between you for these skills.";

    if (existingSwap.status === "PENDING") {
      errorMessage =
        existingSwap.request_from === user_id
          ? "You have already sent a pending swap request."
          : "You already have a pending swap request from this user.";
    }

    if (existingSwap.status === "ACCEPTED") {
      errorMessage = "You already have an active swap for these skills.";
    }

    if (existingSwap.status === "REJECTED") {
      errorMessage =
        "A previous swap request was rejected. You cannot create a new one yet.";
    }

    if (existingSwap.status === "COMPLETED") {
      errorMessage = "You have already completed a swap for these skills.";
    }

    const err = new Error(errorMessage);
    err.statusCode = 409;
    throw err;
  }

  // 4️⃣ Create swap request
  return await prisma.skill_swaps.create({
    data: {
      request_from: user_id,
      request_to: request_to,
      offer_user_skill_id: offer_user_skill_id,
      want_user_skill_id: want_user_skill_id,
      message: message || null,
      scheduled: scheduled || null,
      status: "PENDING",
      created_by: user_id,
    },
  });

  return null
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
      message: true,
      status: true,

      // include chat session (only one per swap)
      chat_sessions: {
        select: {
          id: true,
          is_archived: true,
        },
        take: 1,
      },

      requestFrom: {
        select: {
          id: true,
          email: true,
          user_name: true,
          profile_pic_url: true,
        },
      },
      requestTo: {
        select: {
          id: true,
          email: true,
          user_name: true,
          profile_pic_url: true,
        },
      },
      offerSkill: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              email: true,
              user_name: true,
              profile_pic_url: true,
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
              profile_pic_url: true,
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
