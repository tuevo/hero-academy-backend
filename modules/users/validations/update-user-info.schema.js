const Joi = require("@hapi/joi");

const UpdateUserInfoValidationSchema = Joi.object().keys({
  fullName: Joi.string(),
  introduction: Joi.string().allow(null, ""),
  isBlocked: Joi.boolean()
});

module.exports = {
  UpdateUserInfoValidationSchema,
};
