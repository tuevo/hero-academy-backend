const Joi = require('@hapi/joi');

const DeleteCategoryValidationSchema = Joi.object().keys({
  categoryId: Joi.string().required(),
});

module.exports = {
  DeleteCategoryValidationSchema,
};
