const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');

const UserModel = require('./users.model');
const UserConstant = require('./users.constant');

const findUserByNameOrEmail = async (nameOrEmail) => {
  logger.info(
    `${UserConstant.LOGGER.SERVICE}::findUserByNameOrEmail::is called`
  );
  try {
    const query = {
      $or: [
        {
          email: nameOrEmail,
        },
        {
          fullName: nameOrEmail,
        },
      ],
    };

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::findUserByNameOrEmail::success`
    );

    return await UserModel.findOne(query);
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::findUserByNameOrEmail::Error`,
      e
    );
    throw new Error(e);
  }
};

const mapUserInfo = (userInfo) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::is called`);
  try {
    let userJsonParse = JSON.parse(JSON.stringify(userInfo));

    delete userJsonParse.passwordHash;
    delete userJsonParse.passwordSalt;
    delete userJsonParse.createdAt;
    delete userJsonParse.updatedAt;
    delete userJsonParse.refreshToken;
    delete userJsonParse.__v;
    delete userJsonParse.isConfirmed;

    logger.info(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::success`);

    return userJsonParse;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::Error`, e);
    throw new Error(e);
  }
};

module.exports = {
  findUserByNameOrEmail,
  mapUserInfo,
};
