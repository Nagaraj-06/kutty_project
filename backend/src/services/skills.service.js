const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addOrUpdateSkill(
  user_id,
  skill_id,
  skill_type,
  status = null,
  average_rating = null
) {
  await prisma.user_skills.upsert({
    where: {
      user_id_skill_id: {
        user_id,
        skill_id,
      },
    },
    update: {
      is_active: true,
      skill_type,
      average_rating,
      ...(status ? { status } : {}), // only include if not null
    },
    create: {
      skill_type,
      is_active: true,
      average_rating,
      ...(status ? { status } : {}), // only include if not null (so default works)
      user: { connect: { id: user_id } },
      skill: { connect: { id: skill_id } },
    },
  });
}

async function removeUserSkill(user_id, skill_id) {
  return prisma.user_skills.updateMany({
    where: { user_id: user_id, skill_id: skill_id },
    data: { is_active: false },
  });
}

// Get all skills
async function getSkills() {
  return prisma.skills_master.findMany();
}

// Get users skills
async function getUsersSkills(currentUserId) {
  // Step 1: Get all active swap relationships involving current user
  const activeSwaps = await prisma.skill_swaps.findMany({
    where: {
      OR: [{ request_from: currentUserId }, { request_to: currentUserId }],
      status: { in: ["PENDING", "ACCEPTED"] },
      is_active: true,
    },
    select: {
      request_from: true,
      request_to: true,
    },
  });

  // Step 2: Extract user IDs who have active swaps with current user
  const usersWithActiveSwaps = new Set(
    activeSwaps.flatMap((swap) => [swap.request_from, swap.request_to])
  );
  usersWithActiveSwaps.delete(currentUserId); // Remove current user from set

  // Step 3: Get all skills from users who DON'T have active swaps
  return prisma.user_skills.findMany({
    where: {
      is_active: true,
      user_id: {
        not: currentUserId,
        notIn: Array.from(usersWithActiveSwaps),
      },
    },
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
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      skill_type: true,
      average_rating: true,
    },
  });
}

// Get user skills
async function getUserSkills(user_id) {
  return prisma.user_skills.findMany({
    where: { user_id, is_active: true },
    select: {
      id: true,
      skill_type: true,
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      average_rating: true,
    },
  });
}

module.exports = {
  addOrUpdateSkill,
  removeUserSkill,
  getUserSkills,
  getUsersSkills,
  getSkills,
};
