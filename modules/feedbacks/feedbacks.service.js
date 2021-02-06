const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const FeedbacksConstant = require('./feedbacks.constant');
const FeedbacksModel = require('./feedbacks.model');
const RatingsServices = require('../ratings/ratings.services');
const Services = require('../../services/services');

const createFeedback = async (info) => {
  logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::is called`);
  try {
    const newFeedback = new FeedbacksModel(info);

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::creating...`
    );
    await newFeedback.save();

    logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::success`);
    return newFeedback;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::error`,
      e
    );
    throw new Error(e);
  }
};

const createRating = async ({ lecturer, course, studentId, rating }) => {
  logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createRating::is called`);
  try {
    const ratingInfo = await RatingsServices.getRatingHasConditions({
      courseId: course._id,
      studentId,
    });

    let agvRatingOfCourse = 0;
    let agvRatingOfLecturer = 0;

    if (ratingInfo) {
      const result = calculateAvgRatingWhenExistsInRatingsTable({
        lecturer,
        course,
        ratingInfo,
        rating,
      });

      agvRatingOfCourse = result.agvRatingOfCourse;
      agvRatingOfLecturer = result.agvRatingOfLecturer;

      ratingInfo['isDeleted'] = true;
    } else {
      const result = calculateAvgRatingWhenNotExistsInRatingsTable({
        lecturer,
        course,
        rating,
      });

      agvRatingOfCourse = result.agvRatingOfCourse;
      agvRatingOfLecturer = result.agvRatingOfLecturer;

      course['numberOfRatings'] = course['numberOfRatings'] + 1;
      lecturer['numberOfRatings'] = lecturer['numberOfRatings'] + 1;
    }

    const newRating = await RatingsServices.createRating({
      courseId: course._id,
      rating,
      studentId,
    });

    course['averageRating'] = agvRatingOfCourse;
    lecturer['averageRating'] = agvRatingOfLecturer;

    await course.save();
    await lecturer.save();
    ratingInfo && (await ratingInfo.save());

    logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createRating::success`);
    return newRating;
  } catch (e) {
    logger.error(`${FeedbacksConstant.LOGGER.SERVICE}::createRating::error`, e);
    throw new Error(e);
  }
};

const calculateAvgRatingWhenExistsInRatingsTable = ({
  course,
  lecturer,
  ratingInfo,
  rating,
}) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenExistsInRatingsTable::is called`
  );
  try {
    let agvRatingOfCourse = 0;
    let agvRatingOfLecturer = 0;

    if (course['numberOfRatings'] > 1) {
      let oldRatingOfCourse =
        course['averageRating'] * 2 - ratingInfo['rating'];
      oldRatingOfCourse = Services.rounding(oldRatingOfCourse);

      console.log(oldRatingOfCourse);

      agvRatingOfCourse = (oldRatingOfCourse + rating) / 2;
      agvRatingOfCourse = Services.rounding(agvRatingOfCourse);
    } else {
      agvRatingOfCourse = rating;
    }

    if (lecturer['numberOfRatings'] > 1) {
      let oldRatingOfLecturer =
        lecturer['averageRating'] * 2 - ratingInfo['rating'];
      oldRatingOfLecturer = Services.rounding(oldRatingOfLecturer);

      agvRatingOfLecturer = (oldRatingOfLecturer + rating) / 2;
      agvRatingOfLecturer = Services.rounding(agvRatingOfLecturer);
    } else {
      agvRatingOfLecturer = rating;
    }

    return { agvRatingOfCourse, agvRatingOfLecturer };
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenExistsInRatingsTable::error`,
      e
    );
    throw new Error(e);
  }
};

const calculateAvgRatingWhenNotExistsInRatingsTable = ({
  course,
  lecturer,
  rating,
}) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenNotExistsInRatingsTable::is called`
  );
  try {
    let agvRatingOfCourse =
      course['averageRating'] === 0
        ? rating
        : Services.rounding((course['averageRating'] + rating) / 2);

    let agvRatingOfLecturer =
      lecturer['averageRating'] === 0
        ? rating
        : Services.rounding((lecturer['averageRating'] + rating) / 2);

    return { agvRatingOfCourse, agvRatingOfLecturer };
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenNotExistsInRatingsTable::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createFeedback,
  createRating,
};
