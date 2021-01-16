const log4js = require('log4js');
const logger = log4js.getLogger('Services');

const VideosModel = require('./videos.model');
const VideosConstant = require('./videos.constant');

const createVideo = async (videoInfo) => {
  logger.info(`${VideosConstant.LOGGER.SERVICE}::createVideo::is called`);
  try {
    const newVideo = new VideosModel(videoInfo);

    logger.info(`${VideosConstant.LOGGER.SERVICE}::createVideo::success`);
    return await newVideo.save();
  } catch (e) {
    logger.error(`${VideosConstant.LOGGER.SERVICE}::createVideo::error`, e);
    throw new Error(e);
  }
};

module.exports = {
  createVideo,
};
