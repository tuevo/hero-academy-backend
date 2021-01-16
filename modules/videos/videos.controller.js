const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const VideosConstant = require('./videos.constant');
const VideosServices = require('./videos.service');

const addVideo = async (req, res, next) => {
  logger.info(`${VideosConstant.LOGGER.CONTROLLER}::addVideo::is called`);
  try {
    const { title, duration } = req.body;
    const { courseId, chapterId } = req.params;
    let responseData = null;

    responseData = {
      status: HttpStatus.CREATED,
      messages: [],
      data: {},
    };

    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(`${VideosConstant.LOGGER.CONTROLLER}::addVideo::error`, e);
    return next(e);
  }
};

module.exports = {
  addVideo,
};
