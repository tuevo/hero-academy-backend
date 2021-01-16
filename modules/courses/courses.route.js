const express = require('express');
const router = express.Router({});
const multer = require('multer');
const upload = multer();

const CoursesController = require('./courses.controller');
const VideosController = require('../videos/videos.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const FileTypesConstant = require('../../constants/file-types.constant');
const ValidateFileTypesMiddleware = require('../../middleware/validate-file-types.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckCourseIdMiddleware = require('../../middleware/check-course-id.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');
const RoleConstant = require('../users/users.constant');

const {
  AddVideoValidationSchema,
} = require('../videos/validations/add-video.schema');

router.post(
  '/:courseId/chapters/:chapterId/videos',
  upload.fields([{ name: 'video' }, { name: 'thumbnail' }]),
  ValidateMiddleware(AddVideoValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  ValidateFileTypesMiddleware([
    { name: 'video', fileTypes: [FileTypesConstant.VIDEO] },
    { name: 'thumbnail', fileTypes: [FileTypesConstant.IMAGE] },
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CheckCourseIdMiddleware,
  VideosController.addVideo
);

module.exports = router;
