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
  // Step 1: Get active swaps
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

  // Step 2: Users to exclude
  const usersWithActiveSwaps = new Set(
    activeSwaps.flatMap(swap => [swap.request_from, swap.request_to])
  );
  usersWithActiveSwaps.delete(currentUserId);

  // Step 3: Fetch user skills (flat)
  const rows = await prisma.user_skills.findMany({
    where: {
      is_active: true,
      user_id: {
        not: currentUserId,
        notIn: Array.from(usersWithActiveSwaps),
      },
    },
    select: {
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
          name: true,
        },
      },
      skill_type: true,
    },
  });

  // Step 4: Group by user_id
  const userMap = {};

  for (const row of rows) {
    const userId = row.user.id;

    if (!userMap[userId]) {
      userMap[userId] = {
        id: userId,
        email: row.user.email,
        user_name: row.user.user_name,
        profile_pic_url: row.user.profile_pic_url,
        skills_offered: [],
        skills_wanted: [],
      };
    }

    if (row.skill_type === "OFFERING") {
      userMap[userId].skills_offered.push(row.skill.name);
    } else if (row.skill_type === "WANTED") {
      userMap[userId].skills_wanted.push(row.skill.name);
    }
  }

  // Step 5: Return user-wise array
  return Object.values(userMap);
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
