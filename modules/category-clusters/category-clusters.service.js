const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');

const CategoryClusterModel = require('./category-clusters.model');
const CategoryClusterConstant = require('./category-clusters.constant');

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

module.exports = {
  getCategoryClustersInfoHasPagination,
};
