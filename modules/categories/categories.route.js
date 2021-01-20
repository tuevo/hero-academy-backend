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
const {
  GetCategoryDetailsValidationSchema,
} = require('./validations/get-category-details.schema');
const {
  UpdateCategoryValidationSchema,
} = require('./validations/update-category.schema');

router.post(
  '/',
  ValidateMiddleware(AddCategoryValidationSchema, [ParametersConstant.BODY]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.addCategory
);
router.get(
  '/:categoryId',
  ValidateMiddleware(GetCategoryDetailsValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.getCategoryDetails
);
router.put(
  '/:categoryId',
  ValidateMiddleware(UpdateCategoryValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.BODY,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.updateCategory
);

module.exports = router;
