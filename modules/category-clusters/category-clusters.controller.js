const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const CategoryClustersConstant = require('./category-clusters.constant');
const CategoryClustersServices = require('./category-clusters.service');
const PaginationConstant = require('../../constants/pagination.constant');

const getCategoryClustersInfo = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    let responseData = null;

    const categoryData = await CategoryClustersServices.getCategoryClustersInfoHasPagination(
      { page, limit }
    );

    let { entries } = categoryData[0];
    let { meta } = categoryData[0];

    if (entries.length !== 0) {
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [],
      data: {
        entries,
        meta,
      },
    };

    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getCategoryClustersInfo,
};
