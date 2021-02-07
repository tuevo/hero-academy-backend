const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const RatingsConstant = require('./rating.constant');
const RatingsModel = require('./ratings.model');

const createRating = async (info) => {
  logger.info(`${RatingsConstant.LOGGER.SERVICE}::createRating::is called`);
  try {
    const newRating = new RatingsModel(info);

    logger.info(`${RatingsConstant.LOGGER.SERVICE}::createRating::creating...`);
    await newRating.save();

    logger.info(`${RatingsConstant.LOGGER.SERVICE}::createRating::success`);
    return newRating;
  } catch (e) {
    logger.error(`${RatingsConstant.LOGGER.SERVICE}::createRating::error`, e);
    throw new Error(e);
  }
};

const getRatingHasConditions = async ({ courseId, studentId }) => {
  logger.info(
    `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };

    if (courseId) {
      conditions['courseId'] = courseId;
    }

    if (studentId) {
      conditions['studentId'] = studentId;
    }

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::query`,
      JSON.stringify(conditions)
    );
    const rating = await RatingsModel.findOne(conditions);

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::success`
    );
    return rating;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createRating,
  getRatingHasConditions,
};