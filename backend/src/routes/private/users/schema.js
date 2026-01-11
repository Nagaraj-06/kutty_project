const Joi = require("joi");

/* ===========================
   ENUM DEFINITIONS
=========================== */

const DAY_OF_WEEK = ["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"];
const PROFILE_VISIBILITY = ["PUBLIC", "PRIVATE"];
const SKILL_TYPE = ["WANTED", "OFFERING"];

/* ===========================
   UPDATE PROFILE REQUEST
=========================== */

const updateProfileSchema = Joi.object({
  bio: Joi.string().allow(null, "").optional(),

  profile_visibility: Joi.string()
    .valid(...PROFILE_VISIBILITY)
    .optional(),

  is_active: Joi.boolean().optional(),

  // Availability slots
  slots: Joi.array()
    .items(
      Joi.object({
        day_of_week: Joi.string()
          .valid(...DAY_OF_WEEK)
          .required(),

        from_time: Joi.date().required(),
        to_time: Joi.date().required(),
      }).custom((value, helpers) => {
        if (new Date(value.from_time) >= new Date(value.to_time)) {
          return helpers.message('"from_time" must be earlier than "to_time"');
        }
        return value;
      })
    )
    .optional(),

  // Skills
  skills: Joi.array()
    .items(
      Joi.object({
        skill_id: Joi.string().required(),

        skill_type: Joi.string()
          .valid(...SKILL_TYPE)
          .required(),
      })
    )
    .optional(),
}).unknown(true);

/* ===========================
   UPDATE AVAILABILITY REQUEST
=========================== */

const updateAvailabilitySchema = Joi.array()
  .items(
    Joi.object({
      day_of_week: Joi.string()
        .valid(...DAY_OF_WEEK)
        .required(),

      from_time: Joi.string().isoDate().required(),
      to_time: Joi.string().isoDate().required(),
    }).custom((value, helpers) => {
      if (new Date(value.from_time) >= new Date(value.to_time)) {
        return helpers.message('"from_time" must be earlier than "to_time"');
      }
      return value;
    })
  )
  .required();

/* ===========================
   RESPONSE SCHEMAS
=========================== */

const updateProfileResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Profile updated successfully"),
});

const updateUserAvailabilityResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Availability updated successfully"),
});

/* ===========================
   USER PROFILE RESPONSE
=========================== */

const userProfileResponseSchema = Joi.object({
  success: Joi.boolean().required(),

  data: Joi.object({
    user: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().allow(null).optional(),
      email: Joi.string().email().allow(null).optional(),
      bio: Joi.string().allow(null, "").optional(),
      profile_pic_url: Joi.string().allow(null, "").optional(),

      profile_visibility: Joi.string()
        .valid(...PROFILE_VISIBILITY)
        .required(),
    }).required(),

    availability: Joi.array()
      .items(
        Joi.object({
          day_of_week: Joi.string()
            .valid(...DAY_OF_WEEK)
            .required(),

          from_time: Joi.date().required(),
          to_time: Joi.date().required(),
        })
      )
      .optional(),

    skills: Joi.array()
      .items(
        Joi.object({
          skill_id: Joi.string().required(),
          skill_name: Joi.string().required(),

          skill_type: Joi.string()
            .valid(...SKILL_TYPE)
            .required(),
        })
      )
      .optional(),
  }).required(),
});

/* ===========================
   EXPORTS
=========================== */

module.exports = {
  updateProfileSchema,
  updateAvailabilitySchema,
  updateProfileResponseSchema,
  updateUserAvailabilityResponseSchema,
  userProfileResponseSchema,
};
