const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const CategoryClustersConstant = require("./category-clusters.constant");
const CategoryClustersServices = require("./category-clusters.service");
const PaginationConstant = require("../../constants/pagination.constant");

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
    const meta =
      categoryData[0].meta.length > 0
        ? categoryData[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length !== 0) {
      entries = await CategoryClustersServices.mapCategoryClusterDataWithCategoriesData(
        entries
      );
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO
          .GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::error`,
      e
    );
    return next(e);
  }
};

const addCategoryCLuster = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::is called`
  );
  try {
    const { name } = req.body;
    let responseData = null;
    let categoryCluster = null;

    let categoryClusters = await CategoryClustersServices.findCategoryClustersByName(
      name
    );

    if (categoryClusters.length > 0) {
      categoryCluster = categoryClusters.find(
        (categoryCluster) =>
          categoryCluster.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      );

      if (categoryCluster) {
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [
            CategoryClustersConstant.MESSAGES.ADD_CATEGORY_CLUSTER
              .CATEGORY_CLUSTER_ALREADY_EXISTS,
          ],
        };

        logger.info(
          `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::name already exists`
        );
        return res.status(HttpStatus.BAD_REQUEST).json(responseData);
      }
    }

    categoryCluster = await CategoryClustersServices.createCategoryCluster(
      name
    );

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        CategoryClustersConstant.MESSAGES.ADD_CATEGORY_CLUSTER
          .ADD_CATEGORY_CLUSTER_SUCCESSFULLY,
      ],
      data: {
        categoryCluster,
      },
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::error`,
      e
    );
    return next(e);
  }
};

const updateCategoryCluster = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::is called`
  );
  try {
    const { categoryClusterId } = req.params;
    const { name } = req.body;
    let responseData = null;

    let categoryCluster = await CategoryClustersServices.findCategoryClusterById(
      categoryClusterId
    );

    if (!categoryCluster) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoryClustersConstant.MESSAGES.UPDATE_CATEGORY_CLUSTER
            .CATEGORY_CLUSTER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::category cluster not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    if (name) {
      const categoryClusters = await CategoryClustersServices.findCategoryClustersByName(
        name
      );

      if (categoryClusters.length > 0) {
        const categoryClusterInfo = categoryClusters.find(
          (categoryCluster) =>
            categoryCluster.name.toLocaleLowerCase() ===
            name.toLocaleLowerCase()
        );

        if (categoryClusterInfo) {
          responseData = {
            status: HttpStatus.BAD_REQUEST,
            messages: [
              CategoryClustersConstant.MESSAGES.UPDATE_CATEGORY_CLUSTER
                .CATEGORY_CLUSTER_ALREADY_EXISTS,
            ],
          };

          logger.info(
            `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::name already exists`
          );
          return res.status(HttpStatus.BAD_REQUEST).json(responseData);
        }
      }

      categoryCluster.name = name;
      await categoryCluster.save();
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoryClustersConstant.MESSAGES.UPDATE_CATEGORY_CLUSTER
          .UPDATE_CATEGORY_CLUSTER_SUCCESSFULLY,
      ],
      data: {
        categoryCluster,
      },
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getCategoryClustersInfo,
  addCategoryCLuster,
  updateCategoryCluster,
};
