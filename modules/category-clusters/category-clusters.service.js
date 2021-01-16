const log4js = require('log4js');
const logger = log4js.getLogger('Services');

const CategoryClusterModel = require('./category-clusters.model');
const CategoryClusterConstant = require('./category-clusters.constant');
const CategoriesService = require('../categories/categories.service');

const getCategoryClustersInfoHasPagination = async ({ page, limit }) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::is called`
  );
  try {
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

    const query = [sortStage, facetStage];

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await CategoryClusterModel.aggregate(query);

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const mapCategoryClusterDataWithCategoriesData = async (entries) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::mapCategoryClusterDataWithCategoriesData::is called`
  );
  try {
    let mapData = [];

    await Promise.all(
      entries.map(async (categoryCluster) => {
        const categories = await CategoriesService.getCategoriesByCategoryClusterId(
          categoryCluster._id
        );

        mapData.push({ ...categoryCluster, categories });
        return;
      })
    );

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::mapCategoryClusterDataWithCategoriesData::success`
    );
    return mapData;
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::mapCategoryClusterDataWithCategoriesData::error`,
      e
    );
    throw new Error(e);
  }
};

const findCategoryClusterByName = async (name) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClusterByName::is called`
  );
  try {
    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClusterByName::success`
    );
    return await CategoryClusterModel.findOne({
      name: {
        $regex: name,
        $options: 'i',
      },
    });
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClusterByName::error`,
      e
    );
    throw new Error(e);
  }
};

const createCategoryCluster = async (name) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::createCategoryCluster::is called`
  );
  try {
    const newCategoryCluster = new CategoryClusterModel({
      name,
    });

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::createCategoryCluster::success`
    );
    return await newCategoryCluster.save();
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::createCategoryCluster::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  getCategoryClustersInfoHasPagination,
  mapCategoryClusterDataWithCategoriesData,
  findCategoryClusterByName,
  createCategoryCluster,
};
