const express = require('express');
const router = express.Router({});

const AuthController = require('./auth.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');

const { LoginValidationSchema } = require('./validations/login.schema');

router.post(
  '/login',
  ValidateMiddleware(LoginValidationSchema, [ParametersConstant.BODY]),
  AuthController.login
);

module.exports = router;
