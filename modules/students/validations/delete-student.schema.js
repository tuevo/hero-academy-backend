const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const DeleteStudentDetailValidationSchema = Joi.object().keys({
  studentId: Joi.objectId().required(),
});

module.exports = {
  DeleteStudentDetailValidationSchema,
};
