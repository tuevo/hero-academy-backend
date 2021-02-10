const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const AddCourseValidationSchema = Joi.object().keys({
  categoryId: Joi.objectId().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  content: Joi.string().required(),
  tuition: Joi.number().min(0),
  discountPercent: Joi.number().min(0).max(1),
});

module.exports = {
  AddCourseValidationSchema,
};
