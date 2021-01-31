const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const CoursesModel = require('./courses.model');
const CoursesConstant = require('./courses.constant');
const cloudinary = require('../../utils/cloudinary');
const FileTypesCloudDinaryConstant = require('../../constants/file-types-cloudinary.constant');

const findCoursesHasCondition = async ({ lecturerId, courseId }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasCondition::is called`
  );
  try {
    let condition = {
      isDeleted: false,
    };

    if (lecturerId) {
      condition['lecturerId'] = mongoose.Types.ObjectId(lecturerId);
    }

    if (courseId) {
      condition['_id'] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasCondition::success`
    );
    return await CoursesModel.findOne(condition);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasCondition::error`,
      e
    );
    throw new Error(e);
  }
};

const createCourse = async (courseInfo) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::createCourse::is called`);
  try {
    const newCourse = new CoursesModel(courseInfo);

    logger.info(`${CoursesConstant.LOGGER.SERVICE}::createCourse::success`);
    return newCourse.save();
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.SERVICE}::createCourse::error`, e);
    throw new Error(e);
  }
};

const updateCourse = async ({ course, updateInfo }) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::updateCourse::is called`);
  try {
    let isChange = false;

    if (updateInfo.categoryId) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update categoryId`
      );
      course['categoryId'] = updateInfo.categoryId;
      isChange = true;
    }

    if (updateInfo.title) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update title`
      );
      course['title'] = updateInfo.title;
      isChange = true;
    }

    if (updateInfo.description) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update description`
      );
      course['description'] = updateInfo.description;
      isChange = true;
    }

    if (updateInfo.content) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update content`
      );
      course['content'] = updateInfo.content;
      isChange = true;
    }

    if (updateInfo.tuition) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update tuition`
      );
      course['content'] = updateInfo.content;
      course['tuition'] = updateInfo.tuition;
      isChange = true;
    }

    if (updateInfo.discountPercent) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update discountPercent`
      );
      course['discountPercent'] = updateInfo.discountPercent;
      isChange = true;
    }

    if (updateInfo.thumbnail) {
      if (course['publicId']) {
        logger.info(
          `${CoursesConstant.LOGGER.SERVICE}::updateCourse::remove image`
        );
        await cloudinary.deleteFile(course['publicId']);
      }

      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update image`
      );
      const thumbnailInfo = await cloudinary.uploadByBuffer(
        updateInfo.thumbnail,
        FileTypesCloudDinaryConstant.image
      );
      course['thumbnailUrl'] = thumbnailInfo.url;
      course['publicId'] = thumbnailInfo.public_id;
      isChange = true;
    }

    if (isChange) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update course`
      );
      return await course.save();
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateCourse:: course not change`
    );
    return course;
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.SERVICE}::updateCourse::error`, e);
    throw new Error(e);
  }
};

const findCoursesByIds = (coursesId) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::is called`);
  try {
    const courses = CoursesModel.find({ _id: { $in: coursesId } });

    logger.info(`${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::success`);
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findCoursesHasCondition,
  createCourse,
  updateCourse,
  findCoursesByIds,
};
