const express = require('express');
const router = express.Router({});

const CategoriesController = require('./categories.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const UsersConstant = require('../users/users.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');

const {
  AddCategoryValidationSchema,
} = require('./validations/add-category.schema');

router.post(
  '/',
  ValidateMiddleware(AddCategoryValidationSchema, [ParametersConstant.BODY]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.addCategory
);

module.exports = router;
