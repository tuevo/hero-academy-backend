const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const RegistrationsServices = require('./registrations.service');
const RegistrationsConstant = require('./registrations.constant');
const StudentsServices = require('../students/students.service');

const registerTheCourse = async (req, res, next) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::is called`
  );
  try {
    const { course } = req;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          RegistrationsConstant.MESSAGES.REGiSTER_THE_COURSE.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let registration = await RegistrationsServices.findRegistrationsHasConditions(
      { studentId: roleInfo._id, courseId: course._id }
    );

    if (registration) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          RegistrationsConstant.MESSAGES.REGiSTER_THE_COURSE
            .THE_COURSE_HAS_BEEN_REGISTERED,
        ],
      };

      logger.info(
        `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::the course has been registered
        `
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    registration = await RegistrationsServices.createRegistration({
      studentId: roleInfo._id,
      courseId: course._id,
      price: course.tuition,
    });
    await StudentsServices.updateNumberOfCoursesRegistered({
      studentId: roleInfo._id,
      cumulativeValue: 1,
    });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        RegistrationsConstant.MESSAGES.REGiSTER_THE_COURSE
          .SUCCESSFUL_COURSE_REGISTRATION,
      ],
      data: { registration },
    };

    logger.info(
      `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  registerTheCourse,
};
