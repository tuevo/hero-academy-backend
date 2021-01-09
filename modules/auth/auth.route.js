const express = require('express');
const router = express.Router({});

const AuthController = require('./auth.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');

const { LoginValidationSchema } = require('./validations/login.schema');
const { RefreshValidationSchema } = require('./validations/refresh.schema');


router.post(
  '/login',
  ValidateMiddleware(LoginValidationSchema, [ParametersConstant.BODY]),
  AuthController.login
);

router.post(
  '/refresh',
  ValidateMiddleware(RefreshValidationSchema, [ParametersConstant.BODY]),
  AuthController.refresh
);

module.exports = router;