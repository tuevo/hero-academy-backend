const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const CategoryModel = require('./categories.model');
const CategoryConstant = require('./categories.constant');

const getCategoriesByCategoryClusterId = async (categoryClusterId) => {
  logger.info(
    `${CategoryConstant.LOGGER.SERVICE}::getCategoriesByCategoryClusterId::is called`
  );
  try {
    logger.info(
      `${CategoryConstant.LOGGER.SERVICE}::getCategoriesByCategoryClusterId::success`
    );
    return await CategoryModel.find({
      categoryClusterId: mongoose.Types.ObjectId(categoryClusterId),
    });
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::getCategoriesByCategoryClusterId::error`
        .e
    );
    throw new Error(e);
  }
};

module.exports = {
  getCategoriesByCategoryClusterId,
};
