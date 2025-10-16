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
async function getUsersSkills() {
  return prisma.user_skills.findMany({
    where: {
      is_active: true,
    },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          user_name: true,
        },
      },
    },
  });
}

// Get user skills
async function getUserSkills(user_id) {
  return prisma.user_skills.findMany({
    where: { user_id, is_active: true },
    include: {
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
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
