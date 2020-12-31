const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');
const uuid = require('uuid');

const UserConstant = require('./user.constant');
const UserServices = require('./user.service');

const login = async (req, res, next) => {
  logger.info(`${UserConstant.LOGGER.CONTROLLER}::Login::is called`);
  try {
    const { username, password } = req.body;

    let info = {};
    let user = await UserServices.findUserByUsernameOrEmail(username);

    //user not found
    if (!user) {
      info = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          UserConstant.MESSAGES.LOGIN.MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH,
        ],
      };

      logger.info(`${UserConstant.LOGGER.CONTROLLER}::Login::user not found`);
      return res.status(HttpStatus.BAD_REQUEST).json(info);
    }

    //password not match
    if (
      !UserServices.isValidPasswordHash({
        passwordHash: user.passwordHash,
        password,
      })
    ) {
      info = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          UserConstant.MESSAGES.LOGIN.MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH,
        ],
      };

      logger.info(
        `${UserConstant.LOGGER.CONTROLLER}::Login::password not match`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(info);
    }

    user.refreshToken = uuid.v4();
    await user.save();

    //success
    info = {
      status: HttpStatus.OK,
      messages: [UserConstant.MESSAGES.LOGIN.LOGIN_SUCCESSFULLY],
      data: {
        user: UserServices.mapUserInfo(user),
        meta: {
          accessToken: UserServices.generateToken(user),
        },
      },
    };

    logger.info(`${UserConstant.LOGGER.CONTROLLER}::Login::success`);
    return res.status(HttpStatus.OK).json(info);
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.CONTROLLER}::Login::error`, e);
    return next(e);
  }
};

module.exports = {
  login,
};
