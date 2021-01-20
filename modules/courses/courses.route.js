const express = require('express');
const router = express.Router({});
const multer = require('multer');
const upload = multer();

const RoleConstant = require('../users/users.constant');
const FileTypesConstant = require('../../constants/file-types.constant');
const ParametersConstant = require('../../constants/parameters.constant');
const CoursesController = require('./courses.controller');
const VideosController = require('../videos/videos.controller');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const ValidateFileTypesMiddleware = require('../../middleware/validate-file-types.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckCourseIdMiddleware = require('../../middleware/check-course-id.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');
const CheckChapterIdMiddleware = require('../../middleware/check-chapter-id.middleware');

const {
  AddVideoValidationSchema,
} = require('../videos/validations/add-video.schema');
const {
  GetVideosByChapterValidationSchema,
} = require('../videos/validations/get-videos-by-chapter.schema');

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
  CheckChapterIdMiddleware,
  VideosController.addVideo
);
router.get(
  '/:courseId/chapters/:chapterId/videos',
  ValidateMiddleware(GetVideosByChapterValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  CheckChapterIdMiddleware,
  VideosController.getVideosByChapter
);

module.exports = router;
