const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { host } = require("../config/env");

const convertJoiToSwagger = require("../utils/swaggerConverter");
const {
  signUpSchema,
  signInSchema,
  signUpResponseSchema,
  signInResponseSchema,
  verifyEmailResponseSchema,
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
  userProfileResponseSchema,
} = require("../routes/private/users/schema");

const {
  // addUserSkillSchema,
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
  createSwapResponseSchema,
  markCompleteRequestSchema,
  markCompleteResponseSchema,
} = require("../routes/private/swaps/schema");
const {
  getChatResponseSchema,
  getChatListResponseSchema,
} = require("../routes/private/chat/schema");
const {
  giveFeedbackRequestSchema,
  giveFeedbackResponseSchema,
  getFeedbacksResponseSchema,
} = require("../routes/private/feedback/schema");

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
// const addSkillSwagger = convertJoiToSwagger(addUserSkillSchema);
const removeSkillSwagger = convertJoiToSwagger(removeUserSkillSchema);
const removeUserSkillResponseSwagger = convertJoiToSwagger(
  removeUserSkillResponseSchema
);
const updateStatusSwagger = convertJoiToSwagger(updateStatusSchema);
const createSwapSwagger = convertJoiToSwagger(createSwapSchema);
const swapResponseSwagger = convertJoiToSwagger(swapResponseSchema);
const updateProfileSwagger = convertJoiToSwagger(updateProfileResponseSchema);
const GetUserProfileResponseSwagger = convertJoiToSwagger(
  userProfileResponseSchema
);
const getChatSwaggerSchema = convertJoiToSwagger(getChatResponseSchema);
const addUserSkillSwagger = convertJoiToSwagger(addUserSkillResponseSchema);
const getSkillsSwagger = convertJoiToSwagger(getSkillsResponseSchema);
const getUserSkillsSwagger = convertJoiToSwagger(getUserSkillsResponseSchema);
const getUsersSkillsSwagger = convertJoiToSwagger(getUsersSkillsResponseSchema);
const createSwapResponseSwagger = convertJoiToSwagger(createSwapResponseSchema);
const getChatListSwagger = convertJoiToSwagger(getChatListResponseSchema);
const giveFeedbackSwaggerReq = convertJoiToSwagger(giveFeedbackRequestSchema);
const giveFeedbackSwaggerRes = convertJoiToSwagger(giveFeedbackResponseSchema);
const markCompleteSwaggerReq = convertJoiToSwagger(markCompleteRequestSchema);
const markCompleteSwaggerRes = convertJoiToSwagger(markCompleteResponseSchema);
const verifyEmailSwaggerRes = convertJoiToSwagger(verifyEmailResponseSchema);
const getFeedbacksSwaggerRes = convertJoiToSwagger(getFeedbacksResponseSchema);

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
        GetUserProfileResponse: GetUserProfileResponseSwagger,
        // addOrUpdateSkill: addSkillSwagger,
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
        GetChatListResponse: getChatListSwagger,
        GiveFeedbackRequest: giveFeedbackSwaggerReq,
        GiveFeedbackResponse: giveFeedbackSwaggerRes,
        MarkCompleteRequest: markCompleteSwaggerReq,
        MarkCompleteResponse: markCompleteSwaggerRes,
        VerifyEmailResponse: verifyEmailSwaggerRes,
        GetFeedbacksResponse: getFeedbacksSwaggerRes,
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // optional
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger Docs available at ${host}/api-docs`);
}

module.exports = swaggerDocs;
