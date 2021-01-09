const Joi = require('@hapi/joi');

const RefreshValidationSchema = Joi.object().keys({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
});

module.exports = {
  RefreshValidationSchema,
};
