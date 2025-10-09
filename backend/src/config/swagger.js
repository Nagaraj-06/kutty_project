const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const convertJoiToSwagger = require("../utils/swaggerConverter");
const {
  signUpSchema,
  signInSchema,
  signUpResponseSchema,
  signInResponseSchema,
} = require("../routes/public/auth/schema");

const {
  requestResetSchema,
  resetSchema,
  forgetPasswordRequestResponseSchema,
  forgetPasswordResetResponseSchema,
} = require("../routes/public/forget_password/schema");

const {
  updateProfileSchema,
  updateAvailabilitySchema,
  updateProfileResponseSchema,
  updateUserAvailabilityResponseSchema,
  getUserAvailabilityResponseSchema,
} = require("../routes/private/users/schema");

const {
  addUserSkillSchema,
  removeUserSkillSchema,
} = require("../routes/private/skills/schema");
const {
  createSwapSchema,
  updateStatusSchema,
  swapResponseSchema,
} = require("../routes/private/swaps/schema");

const signUpSwagger = convertJoiToSwagger(signUpSchema);
const signInSwagger = convertJoiToSwagger(signInSchema);
const signInResponseSwagger = convertJoiToSwagger(signInResponseSchema);
const signUpResponseSwagger = convertJoiToSwagger(signUpResponseSchema);
const requestResetSwagger = convertJoiToSwagger(requestResetSchema);
const resetSwagger = convertJoiToSwagger(resetSchema);
const forgetPasswordRequestSwagger = convertJoiToSwagger(
  forgetPasswordRequestResponseSchema
);
const forgetPasswordResetSwagger = convertJoiToSwagger(
  forgetPasswordResetResponseSchema
);
const profileSwagger = convertJoiToSwagger(updateProfileSchema);
const availabilitySwagger = convertJoiToSwagger(updateAvailabilitySchema);
const addSkillSwagger = convertJoiToSwagger(addUserSkillSchema);
const removeSkillSwagger = convertJoiToSwagger(removeUserSkillSchema);
const updateStatusSwagger = convertJoiToSwagger(updateStatusSchema);
const createSwapSwagger = convertJoiToSwagger(createSwapSchema);
const swapResponseSwagger = convertJoiToSwagger(swapResponseSchema);
const updateProfileSwagger = convertJoiToSwagger(updateProfileResponseSchema);
const updateUserAvailabilitySwagger = convertJoiToSwagger(
  updateUserAvailabilityResponseSchema
);
const getUserAvailabilitySwagger = convertJoiToSwagger(
  getUserAvailabilityResponseSchema
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skill Swap API",
      version: "1.0.0",
      description: "Auto-generated Swagger docs using Joi schemas",
    },
    components: {
      schemas: {
        SignUpUser: signUpSwagger,
        signUpResponse: signUpResponseSwagger,
        SignInUser: signInSwagger,
        signInResponse: signInResponseSwagger,
        RequestReset: requestResetSwagger,
        ResetPassword: resetSwagger,
        ForgetPasswordRequestResponse: forgetPasswordRequestSwagger,
        ForgetPasswordResetResponse: forgetPasswordResetSwagger,
        UpdateProfile: profileSwagger,
        UpdateAvailability: availabilitySwagger,
        UpdateProfileResponse: updateProfileSwagger,
        UpdateUserAvailabilityResponse: updateUserAvailabilitySwagger,
        GetUserAvailabilityResponse: getUserAvailabilitySwagger,
        addOrUpdateSkill: addSkillSwagger,
        RemoveUserSkill: removeSkillSwagger,
        createSwapSwagger: createSwapSwagger,
        updateStatusSwagger: updateStatusSwagger,
        swapResponseSwagger: swapResponseSwagger,
      },
    },
  },
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs available at http://localhost:8080/api-docs");
}

module.exports = swaggerDocs;
