const Joi = require("joi");

// Update Profile
const updateProfileSchema = Joi.object({
  bio: Joi.string().allow(null, "").optional(),
  profile_visibility: "PUBLIC (Or) PRIVATE",
  is_active: Joi.boolean().optional(),

  // ✅ Availability slots (array of objects)
  slots: Joi.array()
    .items(
      Joi.object({
        day_of_week:
          "MON (Or) TUES (Or) WED (Or) THURS (Or) FRI (Or) SAT (Or) SUN",
        from_time: Joi.date().required(),
        to_time: Joi.date().required(),
      })
    )
    .optional(),

  // ✅ Skills (array of objects)
  skills: Joi.array()
    .items(
      Joi.object({
        skill_id: Joi.string().required(),
        skill_type: "WANTED (Or) OFFERING",
      })
    )
    .optional(),
}).unknown(true);

const updateProfileResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Profile updated successfully"),
});

// Update Availability
const updateAvailabilitySchema = Joi.array()
  .items(
    Joi.object({
      day_of_week:
        "MON (Or) TUES (Or) WED (Or) THURS (Or) FRI (Or) SAT (Or) SUN",
      from_time: Joi.string().isoDate().required(),
      to_time: Joi.string().isoDate().required(),
    })
  )
  .required();

const updateUserAvailabilityResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Availability updated successfully"),
});

const userProfileResponseSchema = Joi.object({
  success: Joi.boolean().required(),

  data: Joi.object({
    user: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().allow(null).optional(),
      email: Joi.string().email().allow(null).optional(),
      bio: Joi.string().allow(null, "").optional(),
      profile_pic_url: Joi.string().allow(null, "").optional(),
      profile_visibility: "PUBLIC (Or) PRIVATE",
    }).required(),

    availability: Joi.array()
      .items(
        Joi.object({
          day_of_week:
            "MON (Or) TUES (Or) WED (Or) THURS (Or) FRI (Or) SAT (Or) SUN",
          from_time: Joi.date().required(),
          to_time: Joi.date().required(),
        })
      )
      .optional(),

    skills: Joi.array()
      .items(
        Joi.object({
          skill_id: Joi.string().required(),
          skill_name: "Networking",
          skill_type: "WANTED (Or) OFFERING",
        })
      )
      .optional(),
  }).required(),
});

module.exports = {
  updateProfileSchema,
  updateAvailabilitySchema,
  updateProfileResponseSchema,
  updateUserAvailabilityResponseSchema,
  userProfileResponseSchema,
};
