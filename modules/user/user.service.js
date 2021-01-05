const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JwtConfig = require('../../constants/jwt.constant');
const UserModel = require('./user.model');
const UserConstant = require('./user.constant');

const findUserByUsernameOrEmail = async (usernameOrEmail) => {
  logger.info(
    `${UserConstant.LOGGER.SERVICE}::findUserByUsernameOrEmail::is called`
  );
  try {
    const query = {
      $or: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
    };

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::findUserByUsernameOrEmail::success`
    );
    return await UserModel.findOne(query);
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::findUserByUsernameOrEmail::Error`,
      e
    );
    throw new Error(e);
  }
};

const isValidPasswordHash = ({ passwordHash, password }) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::isValidHashPassword::Is called`);
  try {
    logger.info(`${UserConstant.LOGGER.SERVICE}::isValidHashPassword::success`);
    return bcrypt.compareSync(password, passwordHash);
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::isValidHashPassword::Error`,
      e
    );
    throw new Error(e);
  }
};

const generateToken = (data) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::generateToken::Is called`);
  try {
    logger.info(`${UserConstant.LOGGER.SERVICE}::generateToken::success`);
    return jwt.sign({ user: data }, JwtConfig.secret, {
      expiresIn: 60 * 60 * UserConstant.TOKEN_EXPIRED_IN_HOUR,
    });
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::generateToken::Error`, e);
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

    logger.info(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::success`);
    return userJsonParse;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::Error`, e);
    throw new Error(e);
  }
};

module.exports = {
  findUserByUsernameOrEmail,
  isValidPasswordHash,
  generateToken,
  mapUserInfo,
};
