const express = require('express');
const router = express.Router({});
const multer = require('multer');
const upload = multer();

const AuthController = require('./auth.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');

const { LoginValidationSchema } = require('./validations/login.schema');
const {
  RefreshTokenValidationSchema,
} = require('./validations/refresh-token.schema');
const { RegisterValidationSchema } = require('./validations/register.schema');
const {
  ConfirmOptCodeValidationSchema,
} = require('./validations/confim-otp-code.schema');

router.post(
  '/login',
  ValidateMiddleware(LoginValidationSchema, [ParametersConstant.BODY]),
  AuthController.login
);
router.post(
  '/refresh',
  ValidateMiddleware(RefreshTokenValidationSchema, [ParametersConstant.BODY]),
  AuthController.refreshToken
);
router.post(
  '/register',
  upload.single('avatar'),
  ValidateMiddleware(RegisterValidationSchema, [ParametersConstant.BODY]),
  AuthController.register
);
router.post(
  '/confirm',
  ValidateMiddleware(ConfirmOptCodeValidationSchema, [ParametersConstant.BODY]),
  AuthController.confirmOtpCode
);

module.exports = router;
