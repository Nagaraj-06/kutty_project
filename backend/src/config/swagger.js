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
  addUserSkillResponseSchema,
  getSkillsResponseSchema,
  getUserSkillsResponseSchema,
  getUsersSkillsResponseSchema,
  removeUserSkillResponseSchema,
} = require("../routes/private/skills/schema");
const {
  createSwapSchema,
  updateStatusSchema,
  swapResponseSchema,
  createSwapResponseSchema
} = require("../routes/private/swaps/schema");
const { getChatResponseSchema } = require("../routes/private/chat/schema");

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
const removeUserSkillResponseSwagger = convertJoiToSwagger(
  removeUserSkillResponseSchema
);
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
const getChatSwaggerSchema = convertJoiToSwagger(getChatResponseSchema);
const addUserSkillSwagger = convertJoiToSwagger(addUserSkillResponseSchema);
const getSkillsSwagger = convertJoiToSwagger(getSkillsResponseSchema);
const getUserSkillsSwagger = convertJoiToSwagger(getUserSkillsResponseSchema);
const getUsersSkillsSwagger = convertJoiToSwagger(getUsersSkillsResponseSchema);
const createSwapResponseSwagger = convertJoiToSwagger(createSwapResponseSchema);

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
        RemoveSkillResponse: removeUserSkillResponseSwagger,
        createSwapSwagger: createSwapSwagger,
        updateStatusSwagger: updateStatusSwagger,
        swapResponseSwagger: swapResponseSwagger,
        GetChatResponse: getChatSwaggerSchema,
        AddUserSkillResponse: addUserSkillSwagger,
        GetSkillsResponse: getSkillsSwagger,
        GetUserSkillsResponse: getUserSkillsSwagger,
        GetUsersSkillsResponse: getUsersSkillsSwagger,
        createSwapResponseSwagger: createSwapResponseSwagger,
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
