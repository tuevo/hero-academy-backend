const Joi = require('@hapi/joi');

const AddVideoValidationSchema = Joi.object().keys({
  courseId: Joi.string().required(),
  chapterId: Joi.string().required(),
  title: Joi.string().required(),
});

module.exports = {
  AddVideoValidationSchema,
};
