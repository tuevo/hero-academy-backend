const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const CoursesConstant = require('./courses.constant');
const CoursesServices = require('./courses.service');
const CategoriesServices = require('../categories/categories.service');
const Cloudinary = require('../../utils/cloudinary');
const FileTypesCloudinaryConstant = require('../../constants/file-types-cloudinary.constant');
const AdminServices = require('../admins/admins.service');

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
    await AdminServices.updateNumberOfCourses(1);

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

const getCourseDetail = async (req, res, next) => {
  logger.info(
    `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::is called`
  );
  try {
    const course = req.course;
    let responseData = null;

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.GET_COURSE_DETAIL
          .GET_COURSE_DETAIL_SUCCESSFULLY,
      ],
      data: {
        course,
      },
    };

    logger.info(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::error`,
      e
    );
    return next(e);
  }
};

const updateCourse = async (req, res, next) => {
  logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::is called`);
  try {
    let course = req.course;
    const { files } = req;
    let thumbnail = null;
    const {
      categoryId,
      title,
      description,
      content,
      tuition,
      discountPercent,
    } = req.body;
    let responseData = null;

    if (files && Object.keys(files).length !== 0) {
      thumbnail = files['thumbnail'][0];
    }

    if (categoryId) {
      const category = await CategoriesServices.getCategoryById(categoryId);

      if (!category) {
        responseData = {
          status: HttpStatus.NOT_FOUND,
          messages: [CoursesConstant.MESSAGES.UPDATE_COURSE.CATEGORY_NOT_FOUND],
        };

        logger.info(
          `${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::category not found`
        );
        return res.status(HttpStatus.NOT_FOUND).json(responseData);
      }
    }

    const updateInfo = {
      categoryId,
      title,
      description,
      content,
      tuition,
      discountPercent,
      thumbnail,
    };

    course = await CoursesServices.updateCourse({ course, updateInfo });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.UPDATE_COURSE.SUCCESSFUL_UPDATED_COURSE,
      ],
      data: {
        course,
      },
    };

    logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::error`,
      e
    );
    return next(e);
  }
};

const deleteCourse = async (req, res, next) => {
  logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::deleteCourse::is called`);
  try {
    const course = req.course;
    let responseData = null;

    course['isDeleted'] = true;
    await course.save();

    responseData = {
      status: HttpStatus.OK,
      messages: [],
    };

    logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::deleteCourse::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::deleteCourse::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  addCourse,
  getCourseDetail,
  updateCourse,
  deleteCourse,
};
