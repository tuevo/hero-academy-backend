const Joi = require('@hapi/joi');

const AddCourseValidationSchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  content: Joi.string().required(),
  tuition: Joi.number().min(0),
  discountPercent: Joi.number().min(0).max(100),
});

module.exports = {
  AddCourseValidationSchema,
};
