const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const LecturersModel = require('./lecturers.model');
const LecturersConstant = require('./lecturers.constant');
const Services = require('../../services/services');

const findLecturerByUserId = async (userId) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::is called`
  );
  try {
    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::success`
    );

    return await LecturersModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

const createLecturer = async (userId) => {
  logger.info(`${LecturersConstant.LOGGER.SERVICE}::createLecturer::is called`);
  try {
    const newLecturer = new LecturersModel({
      userId,
    });

    logger.info(`${LecturersConstant.LOGGER.SERVICE}::createLecturer::success`);
    return await newLecturer.save();
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::createLecturer::Error`,
      e
    );
    throw new Error(e);
  }
};

const getLecturersByUsersId = async (usersId) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::getLecturersByUsersId::is called`
  );
  try {
    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::getLecturersByUsersId::success`
    );
    return await LecturersModel.find({ userId: { $in: usersId } });
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::getLecturersByUsersId::Error`,
      e
    );
    throw new Error(e);
  }
};

const mapLecturersIntoUsers = ({ users, lecturers }) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::mapLecturersIntoUsers::is called`
  );
  try {
    const result = users.map((user) => {
      const usersJsonParse = Services.deleteFieldsUser(user);
      const lecturer = lecturers.find(
        (lecturer) => user._id.toString() === lecturer.userId.toString()
      );
      return { ...usersJsonParse, roleInfo: lecturer };
    });

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::mapLecturersIntoUsers::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::mapLecturersIntoUsers::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findLecturerByUserId,
  createLecturer,
  getLecturersByUsersId,
  mapLecturersIntoUsers,
};
