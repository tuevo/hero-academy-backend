const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const ChaptersModel = require('./chapters.model');
const ChaptersConstant = require('./chapters.constant');

const findChapterHasCondition = async ({ chapterId, courseId }) => {
  logger.info(
    `${ChaptersConstant.LOGGER.SERVICE}::findChapterHasCondition::is called`
  );
  try {
    let condition = {};

    if (chapterId) {
      condition['_id'] = mongoose.Types.ObjectId(chapterId);
    }

    if (courseId) {
      condition['courseId'] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${ChaptersConstant.LOGGER.SERVICE}::findChapterHasCondition::success`
    );
    return await ChaptersModel.findOne(condition);
  } catch (e) {
    logger.error(
      `${ChaptersConstant.LOGGER.SERVICE}::findChapterHasCondition::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findChapterHasCondition,
};
