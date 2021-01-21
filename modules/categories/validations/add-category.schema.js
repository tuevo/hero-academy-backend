const Joi = require('@hapi/joi');

const AddCategoryValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  categoryClusterId: Joi.string().required(),
});

module.exports = {
  AddCategoryValidationSchema,
};
