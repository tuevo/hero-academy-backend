const express = require('express');
const router = express.Router({});

const CategoryClustersController = require('./category-clusters.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const UsersConstant = require('../users/users.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');

const {
  GetCategoryClustersValidationSchema,
} = require('./validations/get-category-clusters-info.schema');
const {
  AddCategoryClustersValidationSchema,
} = require('./validations/add-category-clusters.schema');

router.get(
  '/',
  ValidateMiddleware(GetCategoryClustersValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CategoryClustersController.getCategoryClustersInfo
);
router.post(
  '/',
  ValidateMiddleware(AddCategoryClustersValidationSchema, [
    ParametersConstant.BODY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoryClustersController.addCategoryCLuster
);

module.exports = router;
