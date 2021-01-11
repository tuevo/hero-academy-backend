const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const UserConstant = require('./users.constant');
const UserServices = require('./users.service');
const AuthServices = require('../auth/auth.service');

const getUserInfo = async (req, res, next) => {
  logger.info(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::is called`);
  try {
    const { _id } = req.user;
    let responseData = null;

    let user = await UserServices.findUserById(_id);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [UserConstant.MESSAGES.GET_USER_INFO.USER_NOT_FOUND],
      };

      logger.info(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::not found`);
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const roleInfo = await AuthServices.checkAndGetRoleInfo({
      userId: _id,
      role: user.role,
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        UserConstant.MESSAGES.GET_USER_INFO.GET_USER_INFO_SUCCESSFULLY,
      ],
      data: {
        user: { roleInfo, ...UserServices.mapUserInfo(user) },
      },
    };

    logger.info(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::error`, e);
    return next(e);
  }
};

module.exports = {
  getUserInfo,
};
