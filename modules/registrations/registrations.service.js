const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const RegistrationsModel = require('./registrations.model');
const RegistrationsConstant = require('./registrations.constant');

const createRegistration = async (info) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::createRegistration::is called`
  );
  try {
    const newRegistration = new RegistrationsModel(info);

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::createRegistration::success`
    );
    return await newRegistration.save();
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::createRegistration::error`,
      e
    );
    throw new Error(e);
  }
};

const findRegistrationsHasConditions = async ({ studentId, courseId }) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsHasConditions::is called`
  );
  try {
    const conditions = {};

    if (studentId) {
      conditions['studentId'] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      conditions['courseId'] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsHasConditions::success`
    );
    return await RegistrationsModel.findOne(conditions);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createRegistration,
  findRegistrationsHasConditions,
};
