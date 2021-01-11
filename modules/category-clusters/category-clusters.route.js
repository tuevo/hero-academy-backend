const express = require('express');
const router = express.Router({});

const CategoryClustersController = require('./category-clusters.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');

const {
  GetCategoryClustersValidationSchema,
} = require('./validations/get-category-clusters-info.schema');

router.get(
  '/',
  ValidateMiddleware(GetCategoryClustersValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware,
  CategoryClustersController.getCategoryClustersInfo
);

module.exports = router;
