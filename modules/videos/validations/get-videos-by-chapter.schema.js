const Joi = require('@hapi/joi');

const GetVideosByChapterValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  courseId: Joi.string().required(),
  chapterId: Joi.string().required(),
});

module.exports = {
  GetVideosByChapterValidationSchema,
};
