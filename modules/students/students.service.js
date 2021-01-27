const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const StudentsModel = require('./students.model');
const StudentsConstant = require('./students.constant');

const findStudentByUserId = async (userId) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::findStudentByUserId::is called`
  );
  try {
    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::findStudentByUserId::success`
    );

    return await StudentsModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::findStudentByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

const createStudent = async (userId) => {
  logger.info(`${StudentsConstant.LOGGER.SERVICE}::createStudent::is called`);
  try {
    const newUser = new StudentsModel({
      userId,
    });

    logger.info(`${StudentsConstant.LOGGER.SERVICE}::createStudent::success`);
    return newUser.save();
  } catch (e) {
    logger.error(`${StudentsConstant.LOGGER.SERVICE}::createStudent::Error`, e);
    throw new Error(e);
  }
};

const updateNumberOfCoursesRegistered = async ({
  studentId,
  cumulativeValue,
}) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegistered::is called`
  );
  try {
    const condition = { $inc: { numberOfCoursesRegistered: cumulativeValue } };

    await StudentsModel.updateOne(
      { _id: mongoose.Types.ObjectId(studentId) },
      condition
    );

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegistered::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegistered::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfFavoriteCourses = async ({
  studentId,
  cumulativeValue,
}) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCourses::is called`
  );
  try {
    const condition = { $inc: { numberOfFavoriteCourses: cumulativeValue } };

    await StudentsModel.updateOne(
      { _id: mongoose.Types.ObjectId(studentId) },
      condition
    );

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCourses::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCourses::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findStudentByUserId,
  createStudent,
  updateNumberOfCoursesRegistered,
  updateNumberOfFavoriteCourses,
};
