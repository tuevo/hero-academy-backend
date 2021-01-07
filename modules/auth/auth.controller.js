const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');
const uuid = require('uuid');

const AuthConstant = require('./auth.constant');
const AuthServices = require('./auth.service');
const UserServices = require('../users/users.service');

const login = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::Login::is called`);
  try {
    const { email, password } = req.body;

    let responseData = null;
    let user = await UserServices.findUserByNameOrEmail(email);

    responseData = AuthServices.checkAccountValidity({
      userAccount: user,
      password,
    });

    if (responseData) {
      return res.status(responseData.status).json(responseData);
    }

    const refreshToken = uuid.v4();
    user.refreshToken = refreshToken;

    await user.save();

    const roleInfo = await AuthServices.checkAndGetRoleInfo({
      userId: user._id,
      role: user.role,
    });

    //success
    responseData = {
      status: HttpStatus.OK,
      messages: [AuthConstant.MESSAGES.LOGIN.LOGIN_SUCCESSFULLY],
      data: {
        user: { roleInfo, ...UserServices.mapUserInfo(user) },
        meta: {
          accessToken: AuthServices.generateToken(user),
          refreshToken,
        },
      },
    };

    logger.info(`${AuthConstant.LOGGER.CONTROLLER}::Login::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::Login::error`, e);
    return next(e);
  }
};

module.exports = {
  login,
};
