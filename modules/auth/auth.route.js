const express = require('express');
const router = express.Router({});
const multer = require('multer');
const upload = multer();

const AuthController = require('./auth.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const FileTypesConstant = require('../../constants/file-types.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const ValidateFileTypesMiddleware = require('../../middleware/validate-file-types.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');

const { LoginValidationSchema } = require('./validations/login.schema');
const {
  RefreshTokenValidationSchema,
} = require('./validations/refresh-token.schema');
const { RegisterValidationSchema } = require('./validations/register.schema');
const {
  ConfirmOptCodeValidationSchema,
} = require('./validations/confim-otp-code.schema');
const {
  ChangePassValidationSchema
} = require('./validations/change-pass.schema');


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
  upload.fields([{ name: 'avatar' }]),
  ValidateMiddleware(RegisterValidationSchema, [ParametersConstant.BODY]),
  ValidateFileTypesMiddleware([
    { name: 'avatar', fileTypes: [FileTypesConstant.IMAGE] },
  ]),
  AuthController.register
);
router.post(
  '/confirm',
  ValidateMiddleware(ConfirmOptCodeValidationSchema, [ParametersConstant.BODY]),
  AuthController.confirmOtpCode
);
router.put(
  '/password',
  ValidateMiddleware(ChangePassValidationSchema, [ParametersConstant.BODY]),
  CheckAccessTokenMiddleware,
  AuthController.changePass
);

module.exports = router;
