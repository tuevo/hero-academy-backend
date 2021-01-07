const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');
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

module.exports = {
  findStudentByUserId,
};
