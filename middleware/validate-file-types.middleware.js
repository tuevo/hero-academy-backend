const log4js = require('log4js');
const logger = log4js.getLogger('Middleware');
const HttpStatus = require('http-status-codes');

const LoggerConstant = require('../constants/logger.constant');

module.exports = (filesType, fieldNames) => (req, res, next) => {
  logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::is called`);
  try {
    const files = req.files;
    let isError = false;
    let responseData = null;

    fieldNames.forEach((fieldName) => {
      if (
        !files ||
        !files[fieldName] ||
        !files[fieldName][0] ||
        !files[fieldName][0]['mimetype']
      ) {
        logger.info(
          `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::${fieldName} is required`
        );
        isError = true;
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [`${fieldName} is required`],
          data: {},
        };

        return;
      }

      const file = files[fieldName][0];
      const isValid = filesType.find((type) => file['mimetype'].includes(type));

      if (!isValid) {
        logger.info(
          `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::Invalid file type`
        );
        isError = true;
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [`Invalid file type`],
          data: {},
        };

        return;
      }
    });

    if (isError) {
      return res.status(responseData.status).json(responseData);
    }

    logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::success`);
    return next();
  } catch (e) {
    logger.error(`${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::error`, e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [e],
      data: {},
    });
  }
};
