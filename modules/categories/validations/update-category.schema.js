const Joi = require('@hapi/joi');

const UpdateCategoryValidationSchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  name: Joi.string(),
  categoryClusterId: Joi.string(),
});

module.exports = {
  UpdateCategoryValidationSchema,
};
