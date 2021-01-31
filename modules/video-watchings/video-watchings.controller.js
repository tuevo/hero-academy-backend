const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const VideoWatchingsServices = require('./video-watchings.service');
const VideoWatchingsConstant = require('./video-watchings.constant');
const VideosServices = require('../videos/videos.service');
const PaginationConstant = require('../../constants/pagination.constant');

const getVideoWatchings = async (req, res, next) => {
  logger.info(
    `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::is called`
  );
  try {
    const { course } = req;
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          VideoWatchingsConstant.MESSAGES.GET_VIDEO_WATCHINGS.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let videoWatchings = await VideoWatchingsServices.getVideoWatchingsHasPagination(
      { courseId: course._id, studentId: roleInfo._id, page, limit }
    );

    let { entries } = videoWatchings[0];
    let meta = [
      {
        _id: null,
        totalItems: 0,
      },
    ];

    if (entries.length > 0) {
      meta = videoWatchings[0].meta;
      const videosId = entries.map((info) => info.videoId);
      const videos = await VideosServices.findVideoByVideosId(videosId);

      entries = VideoWatchingsServices.mapVideosIntoVideoWatchings({
        videoWatchings: entries,
        videos,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        VideoWatchingsConstant.MESSAGES.GET_VIDEO_WATCHINGS
          .GET_VIDEO_WATCHINGS_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getVideoWatchings,
};
