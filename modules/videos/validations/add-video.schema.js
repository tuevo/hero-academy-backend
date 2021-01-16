const Joi = require('@hapi/joi');

const AddVideoValidationSchema = Joi.object().keys({
  courseId: Joi.string().required(),
  chapterId: Joi.string().required(),
  title: Joi.string().required(),
  duration: Joi.number().min(0).required(),
});

module.exports = {
  AddVideoValidationSchema,
};
