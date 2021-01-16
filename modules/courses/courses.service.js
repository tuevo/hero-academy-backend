const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const CoursesModel = require('./courses.model');
const CoursesConstant = require('./courses.constant');

const findCoursesHasCondition = async ({ lecturerId, courseId }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasCondition::is called`
  );
  try {
    let condition = {};

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

module.exports = {
  findCoursesHasCondition,
};
