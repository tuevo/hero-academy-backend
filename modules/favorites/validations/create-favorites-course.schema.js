const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const CreateFavoritesCourseValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
});

module.exports = {
  CreateFavoritesCourseValidationSchema,
};
