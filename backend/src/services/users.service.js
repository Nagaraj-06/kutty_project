const { PrismaClient, DayOfWeek } = require("@prisma/client");
const prisma = new PrismaClient();

// Update user profile
async function updateUserProfile(user_id, updateData) {
  const allowedFields = [
    "bio",
    "profile_pic_url",
    "profile_visibility",
    "is_active",
  ];
  const dataToUpdate = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      dataToUpdate[key] = updateData[key];
    }
  }

  if (Object.keys(dataToUpdate).length === 0) {
    const err = new Error("No valid fields to update");
    err.statusCode = 400;
    throw err;
  }

  dataToUpdate.updated_at = new Date();

  return await prisma.users.update({
    where: { id: user_id },
    data: dataToUpdate,
  });
}

// Update availability
async function updateUserAvailability(user_id, slots) {
  const newSlots = [];

  for (const slot of slots) {
    const fromTime = new Date(slot.from_time);
    const toTime = new Date(slot.to_time);

    // 1. Check if exact slot already exists
    const exactSlot = await prisma.user_availability.findFirst({
      where: {
        user_id,
        day_of_week: slot.day_of_week,
        from_time: fromTime,
        to_time: toTime,
        is_active: true,
      },
    });

    if (exactSlot) {
      // Slot already exists exactly, skip it
      continue;
    }

    // 2. Check for overlapping slots (exclude exact match)
    const overlap = await prisma.user_availability.findFirst({
      where: {
        user_id,
        day_of_week: slot.day_of_week,
        is_active: true,
        OR: [
          {
            from_time: { lt: toTime }, // strictly less than
            to_time: { gt: fromTime }, // strictly greater than
          },
        ],
      },
    });

    if (overlap) {
      throw new Error(
        `Overlapping slot exists for ${slot.day_of_week} ${slot.from_time}-${slot.to_time}`
      );
    }

    // 3. Upsert (create new slot)
    const upserted = await prisma.user_availability.upsert({
      where: {
        user_id_day_of_week_from_time_to_time: {
          user_id,
          day_of_week: slot.day_of_week,
          from_time: fromTime,
          to_time: toTime,
        },
      },
      update: { is_active: true }, // reactivate if soft-deleted
      create: {
        user_id,
        day_of_week: slot.day_of_week,
        from_time: fromTime,
        to_time: toTime,
        is_active: true,
      },
    });

    newSlots.push(upserted);
  }

  return newSlots;
}

async function getUserProfileDetails(user_id) {
  // 1️⃣ Get user basic profile
  const user = await prisma.users.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      user_name: true,
      email: true,
      bio: true,
      profile_pic_url: true,
      profile_visibility: true,
    },
  });

  // 2️⃣ Get user availability
  const availability = await prisma.user_availability.findMany({
    where: { user_id },
    select: {
      day_of_week: true,
      from_time: true,
      to_time: true,
      is_active: true,
    },
    orderBy: { day_of_week: "asc" },
  });

  // 3️⃣ Get user skills + skill_name
  const skills = await prisma.user_skills.findMany({
    where: { user_id, is_active: true },
    select: {
      skill_id: true,
      skill_type: true,
      status: true,
      skill: {
        select: { name: true }, // from skills_master relation
      },
    },
  });

  // 4️⃣ Combine all data
  return {
    user,
    availability,
    skills: skills.map((s) => ({
      skill_id: s.skill_id,
      skill_name: s.skill.skill_name,
      skill_type: s.skill_type,
      status: s.status,
      average_rating: s.average_rating,
    })),
  };
}

module.exports = {
  updateUserProfile,
  updateUserAvailability,
  getUserProfileDetails,
};
