const j2s = require("joi-to-swagger");

/**
 * Converts a Joi schema into Swagger (OpenAPI) schema
 * @param {Joi.Schema} joiSchema
 * @returns {object} swaggerSchema
 */
function convertJoiToSwagger(joiSchema) {
  const { swagger } = j2s(joiSchema);
  return swagger;
}

module.exports = convertJoiToSwagger;
