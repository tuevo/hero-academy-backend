const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const CoursesConstant = require('./courses.constant');
const CoursesServices = require('./courses.service');
const CategoriesServices = require('../categories/categories.service');
const Cloudinary = require('../../utils/cloudinary');
const FileTypesCloudinaryConstant = require('../../constants/file-types-cloudinary.constant');

const addCourse = async (req, res, next) => {
  logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::addCourse::is called`);
  try {
    const {
      categoryId,
      title,
      description,
      content,
      tuition,
      discountPercent,
    } = req.body;
    const roleInfo = req.user.roleInfo || null;
    const thumbnail = req.files.thumbnail[0] || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [CoursesConstant.MESSAGES.ADD_COURSE.LECTURER_NOT_FOUND],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::addCourse::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const category = await CategoriesServices.getCategoryById(categoryId);

    if (!category) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [CoursesConstant.MESSAGES.ADD_COURSE.CATEGORY_NOT_FOUND],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::addCourse::category not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const imageInfo = await Cloudinary.uploadByBuffer(
      thumbnail,
      FileTypesCloudinaryConstant.image
    );

    const newCourse = {
      categoryId,
      title,
      description,
      content,
      tuition: tuition || 0,
      discountPercent: discountPercent || 0,
      lecturerId: roleInfo._id,
      thumbnailUrl: imageInfo.url,
      publicId: imageInfo.public_id,
    };

    const course = await CoursesServices.createCourse(newCourse);

    responseData = {
      status: HttpStatus.CREATED,
      messages: [CoursesConstant.MESSAGES.ADD_COURSE.COURSE_ADDED_SUCCESSFULLY],
      data: {
        course,
      },
    };

    logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::addCourse::success`);
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.CONTROLLER}::addCourse::error`, e);
    return next(e);
  }
};

module.exports = {
  addCourse,
};
