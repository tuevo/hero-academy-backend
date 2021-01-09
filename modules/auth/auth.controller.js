const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');
const uuid = require('uuid');

const AuthConstant = require('./auth.constant');
const AuthServices = require('./auth.service');
const UserServices = require('../users/users.service');

const JwtConfig = require('../../constants/jwt.constant');
const jwt = require('jsonwebtoken');

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

const refresh = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::Refresh::is called`);
  try {
    const { accessToken, refreshToken } = req.body;
    jwt.verify(accessToken, JwtConfig.secret, { ignoreExpiration: true },
      async (err, payload) => {
        if (err) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            messages: [err.message]
          });
        }

        const { _id } = payload.user;

        const isValidRefreshToken = await UserServices.isValidRefreshToken(_id, refreshToken);

        if (!isValidRefreshToken) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            messages: [AuthConstant.MESSAGES.REFRESH.INVALID_REFRESH_TOKEN]
          });
        }

        const newAccessToken = jwt.sign({ user: payload.user }, JwtConfig.secret, { expiresIn: 60 * 60 * AuthConstant.TOKEN_EXPIRED_IN_HOUR });
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          messages: [AuthConstant.MESSAGES.REFRESH.REFRESH_SUCCESSFULLY],
          data: {
            accessToken: newAccessToken
          },
        });
      }
    );

    logger.info(`${AuthConstant.LOGGER.CONTROLLER}::Refresh::Success`);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::Refresh::Error`, e);
    return next(e);
  }
};

module.exports = {
  login,
  refresh
};
