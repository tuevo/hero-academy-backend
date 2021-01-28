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

module.exports = {
  deleteFieldsUser,
};
