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
const {
  AddCourseValidationSchema,
} = require('./validations/add-course.schema');
const {
  GetCourseDetailValidationSchema,
} = require('./validations/get-course-detail.schema');
const {
  DeleteCourseDetailValidationSchema,
} = require('./validations/delete-course.schema');
const {
  UpdateCourseValidationSchema,
} = require('./validations/update-course.schema');

router.post(
  '/',
  upload.fields([{ name: 'thumbnail' }]),
  ValidateMiddleware(AddCourseValidationSchema, [ParametersConstant.BODY]),
  ValidateFileTypesMiddleware([
    {
      name: 'thumbnail',
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: true,
    },
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CoursesController.addCourse
);
router.get(
  '/:courseId/',
  ValidateMiddleware(GetCourseDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  CoursesController.getCourseDetail
);
router.delete(
  '/:courseId',
  ValidateMiddleware(DeleteCourseDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  CoursesController.deleteCourse
);
router.put(
  '/:courseId/',
  upload.fields([{ name: 'thumbnail' }]),
  ValidateMiddleware(UpdateCourseValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  ValidateFileTypesMiddleware([
    {
      name: 'thumbnail',
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: false,
    },
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CheckCourseIdMiddleware({ isLecturer: true }),
  CoursesController.updateCourse
);
router.post(
  '/:courseId/chapters/:chapterId/videos',
  upload.fields([{ name: 'video' }, { name: 'thumbnail' }]),
  ValidateMiddleware(AddVideoValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  ValidateFileTypesMiddleware([
    { name: 'video', fileTypes: [FileTypesConstant.VIDEO], isRequired: true },
    {
      name: 'thumbnail',
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: true,
    },
  ]),
  CheckAccessTokenMiddleware,
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CheckCourseIdMiddleware({ isLecturer: true }),
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
  CheckCourseIdMiddleware({ isLecturer: false }),
  VideosController.getVideosByChapter
);

module.exports = router;
