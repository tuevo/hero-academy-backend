const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const FeedbacksConstant = require('./feedbacks.constant');
const FeedbacksServices = require('./feedbacks.service');
const LecturersServices = require('../lecturers/lecturers.service');
const RegistrationsServices = require('../registrations/registrations.service');

const addFeedback = async (req, res, next) => {
  logger.info(`${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::is called`);
  try {
    const { course } = req;
    const { content } = req.body;
    const rating = Number(req.body.rating) || null;
    const { roleInfo } = req.user || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [FeedbacksConstant.MESSAGES.ADD_FEEDBACKS.STUDENT_NOT_FOUND],
      };

      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const registration = await RegistrationsServices.findRegistrationsHasConditions(
      { studentId: roleInfo._id, courseId: course._id }
    );

    if (!registration) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          FeedbacksConstant.MESSAGES.ADD_FEEDBACKS
            .STUDENT_HAVE_NOT_REGISTERED_FOR_THIS_COURSE,
        ],
      };

      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::student have not registered for this course`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    const lecturer = await LecturersServices.findLecturerById(
      course.lecturerId
    );

    if (content) {
      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::create feedback`
      );
      await FeedbacksServices.createFeedback({
        courseId: course._id,
        content,
        studentId: roleInfo._id,
      });
    }

    if (rating) {
      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::create rating`
      );
      await FeedbacksServices.createRating({
        lecturer,
        course,
        studentId: roleInfo._id,
        rating,
      });
    }

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        FeedbacksConstant.MESSAGES.ADD_FEEDBACKS.ADDED_FEEDBACKS_SUCCESSFULLY,
      ],
    };

    logger.info(`${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::success`);
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  addFeedback,
};
