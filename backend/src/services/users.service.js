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

  dataToUpdate.updated_at = new Date(); // update timestamp

  const updatedUser = await prisma.users.update({
    where: { id: user_id },
    data: dataToUpdate,
  });

  return updatedUser;
}

// Update availability
async function updateUserAvailability(user_id, slots) {
  const newSlots = [];

  for (const slot of slots) {
    // 1. Check for overlapping slots
    const overlap = await prisma.user_availability.findFirst({
      where: {
        user_id: user_id,
        day_of_week: slot.day_of_week,
        is_active: true,
        OR: [
          {
            from_time: { lte: new Date(slot.to_time) },
            to_time: { gte: new Date(slot.from_time) },
          },
        ],
      },
    });

    if (overlap) {
      throw new Error(
        `Overlapping slot exists for ${slot.day_of_week} ${slot.from_time}-${slot.to_time}`
      );
    }

    // 2. Upsert (create new slot)
    const upserted = await prisma.user_availability.upsert({
      where: {
        user_id_day_of_week_from_time_to_time: {
          user_id: user_id,
          day_of_week: slot.day_of_week,
          from_time: new Date(slot.from_time),
          to_time: new Date(slot.to_time),
        },
      },
      update: { is_active: true }, // reactivate if soft-deleted
      create: {
        user_id: user_id,
        day_of_week: slot.day_of_week,
        from_time: new Date(slot.from_time),
        to_time: new Date(slot.to_time),
        is_active: true,
      },
    });

    newSlots.push(upserted);
  }

  return newSlots;
}

// Get user availability slots
async function getUserAvailability(user_id) {
  return prisma.user_availability.findMany({
    where: { user_id },
    select: {
      day_of_week: true,
      from_time: true,
      to_time: true,
    },
  });
}


module.exports = {
  updateUserProfile,
  updateUserAvailability,
  getUserAvailability,
};
