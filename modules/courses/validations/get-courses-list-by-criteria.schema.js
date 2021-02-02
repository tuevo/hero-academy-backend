const Joi = require('@hapi/joi');
const CourseConstant = require('../courses.constant');

const GetCoursesListByCriteriaValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  keyword: Joi.string(),
  isSortUpAscending: Joi.bool(),
  sortBy: Joi.string().valid([CourseConstant.SORT_BY]),
});

module.exports = {
  GetCoursesListByCriteriaValidationSchema,
};
