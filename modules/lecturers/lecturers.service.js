const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');
const mongoose = require('mongoose');

const LecturersModel = require('./lecturers.model');
const LecturersConstant = require('./lecturers.constant');

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
    });
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findLecturerByUserId,
};
