const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const logger = log4js.getLogger('Middlewares');

const JwtConfig = require('../constants/jwt.constant');
const LoggerConstant = require('../constants/logger.constant');
const ApiTokenNameConstant = require('../constants/api-token-name.constant');

const returnInvalidToken = (req, res) => {
  return res.status(HttpStatus.UNAUTHORIZED).json({
    status: HttpStatus.UNAUTHORIZED,
    messages: ['Invalid token'],
    data: {},
  });
};

module.exports = async (req, res, next) => {
  logger.info(`${LoggerConstant.MIDDLEWARE.CHECK_ACCESS_TOKEN}::is called`);
  try {
    const token =
      req.headers[ApiTokenNameConstant.ApiTokenName] ||
      req.query[ApiTokenNameConstant.ApiTokenName] ||
      null;

    if (token === null || token === undefined || token === '') {
      logger.info(
        `${LoggerConstant.MIDDLEWARE.CHECK_ACCESS_TOKEN}::access token not found.`
      );
      returnInvalidToken(req, res, next);
      return;
    }

    const data = jwt.verify(token, JwtConfig.secret);

    if (data === null || data === undefined || data === '') {
      logger.info(
        `${LoggerConstant.MIDDLEWARE.CHECK_ACCESS_TOKEN}::data not found.`
      );
      returnInvalidToken(req, res, next);
      return;
    }

    const user = data['user'];

    if (user === null || user === undefined || user === '') {
      logger.info(
        `${LoggerConstant.MIDDLEWARE.CHECK_ACCESS_TOKEN}::user not found.`
      );
      returnInvalidToken(req, res, next);
      return;
    }

    req.user = user;
    logger.info(`${LoggerConstant.MIDDLEWARE.CHECK_ACCESS_TOKEN}::success.`);
    return next();
  } catch (e) {
    logger.error(`${LoggerConstant.MIDDLEWARE.CHECK_ACCESS_TOKEN}::error.`, e);
    returnInvalidToken(req, res, next);
  }
};
