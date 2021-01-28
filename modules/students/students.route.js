const express = require('express');
const router = express.Router({});

const RoleConstant = require('../users/users.constant');
const ParametersConstant = require('../../constants/parameters.constant');
const StudentsControllers = require('./students.controller');

const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');

const {
  GetStudentsListValidationSchema,
} = require('./validations/get-students-list.schema');
const {
  GetStudentDetailValidationSchema,
} = require('./validations/get-student-detail.schema');
const {
  DeleteStudentDetailValidationSchema,
} = require('./validations/delete-student.schema');

router.get(
  '/',
  ValidateMiddleware(GetStudentsListValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.getStudentsList
);
router.get(
  '/:studentId/',
  ValidateMiddleware(GetStudentDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.getStudentDetail
);
router.delete(
  '/:studentId/',
  ValidateMiddleware(DeleteStudentDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.deleteStudent
);

module.exports = router;
