const Joi = require('@hapi/joi');

const GetCategoryDetailsValidationSchema = Joi.object().keys({
  categoryId: Joi.string().required(),
});

module.exports = {
  GetCategoryDetailsValidationSchema,
};
