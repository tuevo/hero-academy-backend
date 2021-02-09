const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const VideosConstant = require('./videos.constant');
const FileTypesCloudDinaryConstant = require('../../constants/file-types-cloudinary.constant');
const VideosServices = require('./videos.service');
const cloudinary = require('../../utils/cloudinary');
const getDuration = require('../../services/get-duration');
const ChaptersServices = require('../chapters/chapters.service');
const PaginationConstant = require('../../constants/pagination.constant');
const RegistrationServices = require('../registrations/registrations.service');

const addVideo = async (req, res, next) => {
  logger.info(`${VideosConstant.LOGGER.CONTROLLER}::addVideo::is called`);
  try {
    const { title } = req.body;
    const { courseId, chapterId } = req.params;
    const video = req.files.video[0];
    const thumbnail = req.files.thumbnail[0];
    let responseData = null;

    const duration = await getDuration(video);
    const videoInfo = await cloudinary.uploadByBuffer(
      video,
      FileTypesCloudDinaryConstant.video
    );
    const thumbnailInfo = await cloudinary.uploadByBuffer(
      thumbnail,
      FileTypesCloudDinaryConstant.image
    );

    const newVideoInfo = {
      courseId,
      chapterId,
      title,
      thumbnailUrl: thumbnailInfo.url,
      url: videoInfo.url,
      duration,
      publicIdOfVideo: videoInfo.public_id,
      publicIdOfThumbnail: thumbnailInfo.public_id,
    };

    const newVideo = await VideosServices.createVideo(newVideoInfo);
    await ChaptersServices.updateNumberOfVideos(chapterId, 1);

    responseData = {
      status: HttpStatus.CREATED,
      messages: [VideosConstant.MESSAGES.ADD_VIDEO.VIDEO_ADDED_SUCCESSFULLY],
      data: {
        video: newVideo,
      },
    };

    logger.info(`${VideosConstant.LOGGER.CONTROLLER}::addVideo::success`);
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(`${VideosConstant.LOGGER.CONTROLLER}::addVideo::error`, e);
    return next(e);
  }
};

const getVideosByChapter = async (req, res, next) => {
  logger.info(
    `${VideosConstant.LOGGER.CONTROLLER}::getVideosByChapter::is called`
  );
  try {
    const { chapterId } = req.params;
    const { course } = req;
    // const page = Number(req.query.page) || PaginationConstant.PAGE;
    // const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const { user } = req;
    const roleInfo = !user ? null : user.roleInfo;
    let responseData = null;
    let isRegistered = false;

    if (roleInfo && roleInfo._id) {
      const registration = await RegistrationServices.findRegistrationsHasConditions(
        { studentId: roleInfo._id, courseId: course._id }
      );

      if (registration) isRegistered = true;
    }

    const limit = isRegistered ? null : 1;

    const videos = await VideosServices.getVideosByChapterHasConditions({
      chapterId,
      sortBy: 'createdAt',
      isSortUpAscending: true,
      limit,
    });

    // const videoData = await VideosServices.getVideoByChapterHasPagination({
    //   page,
    //   limit,
    //   chapterId,
    // });

    // let { entries } = videoData[0];
    // let meta =
    //   entries.length > 0
    //     ? videoData[0].meta[0]
    //     : {
    //         _id: null,
    //         totalItems: 0,
    //       };

    responseData = {
      status: HttpStatus.OK,
      messages: [VideosConstant.MESSAGES.GET_VIDEOS_BY_CHAPTER.SUCCESS],
      // data: {
      //   entries,
      //   meta,
      // },
      data: {
        videos,
      },
    };

    logger.info(
      `${VideosConstant.LOGGER.CONTROLLER}::getVideosByChapter::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.CONTROLLER}::getVideosByChapter::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  addVideo,
  getVideosByChapter,
};
