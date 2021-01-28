const express = require('express');
const router = express.Router({});

const RoleConstant = require('../users/users.constant');
const ParametersConstant = require('../../constants/parameters.constant');
const LecturersControllers = require('./lecturers.controller');

const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');

const {
  GetLecturersListValidationSchema,
} = require('./validations/get-lecturers-list.schema');
const {
  GetLecturerDetailValidationSchema,
} = require('./validations/get-lecturer-detail.schema');
const {
  DeleteLecturerValidationSchema,
} = require('./validations/delete-lecturer.schema');

router.get(
  '/',
  ValidateMiddleware(GetLecturersListValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.getLecturersList
);
router.get(
  '/:lecturerId/',
  ValidateMiddleware(GetLecturerDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.getLecturerDetail
);
router.delete(
  '/:lecturerId/',
  ValidateMiddleware(DeleteLecturerValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.deleteLecturer
);

module.exports = router;
