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
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::getCategoriesByCategoryClusterId::error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfCourses = async (categoryId, cumulativeValue) => {
  logger.info(
    `${CategoryConstant.LOGGER.SERVICE}::updateNumberOfCourses::is called`
  );
  try {
    const condition = { $inc: { numberOfCourses: cumulativeValue } };

    await CategoryModel.updateOne(
      { _id: mongoose.Types.ObjectId(categoryId) },
      condition
    );

    logger.info(
      `${CategoryConstant.LOGGER.SERVICE}::updateNumberOfCourses::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::updateNumberOfCourses::error`,
      e
    );
    throw new Error(e);
  }
};

const createCategory = async (categoryInfo) => {
  logger.info(`${CategoryConstant.LOGGER.SERVICE}::createCategory::is called`);
  try {
    const newCategory = new CategoryModel(categoryInfo);

    logger.info(`${CategoryConstant.LOGGER.SERVICE}::createCategory::success`);
    return await newCategory.save();
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::createCategory::error`,
      e
    );
    throw new Error(e);
  }
};

const findCategoryByName = async (name) => {
  logger.info(
    `${CategoryConstant.LOGGER.SERVICE}::findCategoryByName::is called`
  );
  try {
    logger.info(
      `${CategoryConstant.LOGGER.SERVICE}::findCategoryByName::success`
    );
    return await CategoryModel.findOne({
      name: {
        $regex: name,
        $options: 'i',
      },
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::findCategoryByName::error`,
      e
    );
    throw new Error(e);
  }
};

const getCategoryById = async (categoryId) => {
  logger.info(`${CategoryConstant.LOGGER.SERVICE}::getCategoryById::is called`);
  try {
    logger.info(`${CategoryConstant.LOGGER.SERVICE}::getCategoryById::success`);
    return await CategoryModel.findOne({
      _id: mongoose.Types.ObjectId(categoryId),
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::getCategoryById::error`,
      e
    );
    throw new Error(e);
  }
};

const updateCategory = async ({ name, categoryClusterId, category }) => {
  logger.info(`${CategoryConstant.LOGGER.SERVICE}::updateCategory::is called`);
  try {
    let flag = false;

    if (name) {
      logger.info(
        `${CategoryConstant.LOGGER.SERVICE}::updateCategory::update name`
      );
      category.name = name;
      flag = true;
    }

    if (categoryClusterId) {
      logger.info(
        `${CategoryConstant.LOGGER.SERVICE}::updateCategory::update categoryClusterId`
      );
      category.categoryClusterId = categoryClusterId;
      flag = true;
    }

    if (flag) {
      logger.info(
        `${CategoryConstant.LOGGER.SERVICE}::updateCategory::updating...`
      );
      await category.save();
    }

    logger.info(`${CategoryConstant.LOGGER.SERVICE}::updateCategory::success`);
    return category;
  } catch (e) {
    logger.error(
      `${CategoryConstant.LOGGER.SERVICE}::updateCategory::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  getCategoriesByCategoryClusterId,
  updateNumberOfCourses,
  createCategory,
  findCategoryByName,
  getCategoryById,
  updateCategory,
};
