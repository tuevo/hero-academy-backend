const log4js = require('log4js');
const logger = log4js.getLogger('Services');

const deleteFieldsUser = (user) => {
  logger.info(`SERVICE::deleteFieldsUser::is called`);
  try {
    let userJsonParse = JSON.parse(JSON.stringify(user));

    delete userJsonParse.passwordHash;
    delete userJsonParse.passwordSalt;
    delete userJsonParse.updatedAt;
    delete userJsonParse.refreshToken;
    delete userJsonParse.__v;
    delete userJsonParse.otpCode;

    logger.info(`SERVICE::deleteFieldsUser::Success`);

    return userJsonParse;
  } catch (e) {
    logger.error(`SERVICE::deleteFieldsUser::Error`, e);
    throw new Error(e);
  }
};

const rounding = (number) => {
  logger.info(`SERVICE::rounding::is called`);
  try {
    logger.info(`SERVICE::rounding::Success`);

    return Math.round(number * 100) / 100;
  } catch (e) {
    logger.error(`SERVICE::rounding::Error`, e);
    throw new Error(e);
  }
};

const onlyUnique = (value, index, self) => {
  logger.info(`SERVICE::onlyUnique::is called`);
  try {
    logger.info(`SERVICE::onlyUnique::success`);
    return self.indexOf(value) === index;
  } catch (e) {
    logger.error(`SERVICE::onlyUnique::Error`, e);
    throw new Error(e);
  }
};

const mapLecturersAndUsersIntoCourse = ({ lecturers, users, courses }) => {
  logger.info(`SERVICE::mapLecturersIntoUsers::is called`);
  try {
    const result = courses.map((course) => {
      const lecturer = lecturers.find(
        (lecturer) => lecturer._id.toString() === course.lecturerId.toString()
      );

      let user = lecturer
        ? users.find(
            (user) => user._id.toString() === lecturer.userId.toString()
          )
        : null;

      user = user && deleteFieldsUser(user);

      return { ...course, lecturer: user ? { ...user, lecturer } : user };
    });
    logger.info(`SERVICE::mapLecturersIntoUsers::success`);
    return result;
  } catch (e) {
    logger.error(`SERVICE::mapLecturersIntoUsers::Error`, e);
    throw new Error(e);
  }
};

module.exports = {
  deleteFieldsUser,
  rounding,
  onlyUnique,
  mapLecturersAndUsersIntoCourse,
};
