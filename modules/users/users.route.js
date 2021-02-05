const express = require('express');
const router = express.Router({});
const multer = require('multer');
const upload = multer();

const UserController = require('./users.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const FileTypesConstant = require('../../constants/file-types.constant');

const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const ValidateFileTypesMiddleware = require('../../middleware/validate-file-types.middleware');

const {
  UpdateUserInfoValidationSchema,
} = require('./validations/update-user-info.schema');

router.get('/', CheckAccessTokenMiddleware, UserController.getUserInfo);
router.put(
  '/',
  upload.fields([{ name: 'avatar' }]),
  ValidateMiddleware(UpdateUserInfoValidationSchema, [ParametersConstant.BODY]),
  ValidateFileTypesMiddleware([
    {
      name: 'avatar',
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: false,
    },
  ]),
  CheckAccessTokenMiddleware,
  UserController.updateUserInfo
);

module.exports = router;
