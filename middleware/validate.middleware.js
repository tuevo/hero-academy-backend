const log4js = require('log4js');
const logger = log4js.getLogger('Middleware');
const Joi = require('@hapi/joi');
const requestUtil = require('../utils/request-util');

const LoggerConstant = require('../constants/logger.constant');

module.exports = (schema, parameters) => (req, res, next) => {
  logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE}::is called`);
  try{
    let dataNeedValidation = {};
    parameters.forEach(element => Object.assign(dataNeedValidation, req[element]));

    const { error } = Joi.validate(dataNeedValidation, schema);

      if (error) {
        return requestUtil.joiValidationResponse(error, res);
      }

      logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE}:validate::success`);
      return next();
  }catch(e){
    logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE}:validate::error`, e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [e],
      data: {}
    });
  }
};