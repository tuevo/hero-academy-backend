const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const CategoriesConstant = require('./categories.constant');
const CategoriesServices = require('./categories.service');
const CategoryClusterServices = require('../category-clusters/category-clusters.service');

const addCategory = async (req, res, next) => {
  logger.info(
    `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::is called`
  );
  try {
    const { categoryClusterId, name } = req.body;
    let responseData = null;

    const categoryCluster = await CategoryClusterServices.findCategoryClusterById(
      categoryClusterId
    );

    if (!categoryCluster) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_CLUSTER_NOT_FOUND,
        ],
      };
      logger.info(
        `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::is called`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let category = await CategoriesServices.findCategoryByName(name);

    if (category) {
      if (category.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [
            CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_ALREADY_EXISTS,
          ],
        };

        logger.info(
          `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::category already exists`
        );
        return res.status(HttpStatus.BAD_REQUEST).json(responseData);
      }
    }

    category = await CategoriesServices.createCategory({
      name,
      categoryClusterId,
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_ADDED_SUCCESSFULLY,
      ],
      data: {
        category,
      },
    };

    logger.info(
      `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  addCategory,
};
