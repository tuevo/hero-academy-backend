const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

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

const getVideoByChapterHasPagination = async ({ page, limit, chapterId }) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::is called`
  );
  try {
    const matchStage = {
      $match: {
        chapterId: mongoose.Types.ObjectId(chapterId),
      },
    };
    const sortStage = {
      $sort: {
        createdAt: -1,
      },
    };

    const facetStage = {
      $facet: {
        entries: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }],
      },
    };

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await VideosModel.aggregate(query);

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const findVideoByVideosId = async (videosId) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::findVideoByVideosId::is called`
  );
  try {
    const videosIdMapObjectId = videosId.map((video) =>
      mongoose.Types.ObjectId(video)
    );

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::findVideoByVideosId::success`
    );
    return await VideosModel.find({ _id: { $in: videosIdMapObjectId } });
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::findVideoByVideosId::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createVideo,
  getVideoByChapterHasPagination,
  findVideoByVideosId,
};
