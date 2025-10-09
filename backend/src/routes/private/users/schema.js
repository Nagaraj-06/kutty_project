const Joi = require("joi");

// Update Profile
const updateProfileSchema = Joi.object({
  bio: Joi.string().optional(),
  profile_pic_url: Joi.string().uri().optional(),
  profile_visibility: Joi.string().valid("PUBLIC", "PRIVATE").optional(),
  is_active: Joi.boolean().optional(),
});

const updateProfileResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Profile updated successfully"),
  // user: Joi.object({
  //   id: Joi.string().example("e3a1f93c-5d8f-4c4b-a7c9-8c12dca29a0e"),
  //   bio: Joi.string().example("Full-stack developer with 3 years of experience"),
  //   profile_pic_url: Joi.string().uri().example("https://example.com/profile.jpg"),
  //   profile_visibility: Joi.string().valid("public", "private").example("public"),
  //   is_active: Joi.boolean().example(true),
  // }),
});

// Update Availability
const updateAvailabilitySchema = Joi.array()
  .items(
    Joi.object({
      day_of_week: Joi.string()
        .valid("MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN")
        .required(),
      from_time: Joi.string().isoDate().required(),
      to_time: Joi.string().isoDate().required(),
    })
  )
  .required();

const updateUserAvailabilityResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Availability updated successfully"),
});

const slotSchema = Joi.object({
  day: Joi.string().example("Monday"),
  start_time: Joi.string().example("10:00 AM"),
  end_time: Joi.string().example("12:00 PM"),
});

const getUserAvailabilityResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array()
    .items(slotSchema)
    .example([
      {
        day_of_week: "MON",
        from_time: "2025-09-08T10:00:00.000Z",
        to_time: "2025-09-08T12:00:00.000Z",
      },
    ]),
});

module.exports = {
  updateProfileSchema,
  updateAvailabilitySchema,
  updateProfileResponseSchema,
  updateUserAvailabilityResponseSchema,
  getUserAvailabilityResponseSchema,
};
