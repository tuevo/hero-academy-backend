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

router.get(
  '/',
  ValidateMiddleware(GetStudentsListValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.getStudentsList
);

module.exports = router;
