const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const FavoritesModel = require('./favorites.model');
const FavoritesConstant = require('./favorites.constant');

const getFavoritesByConditionsHasPagination = async ({
  studentId,
  courseId,
  limit,
  page,
}) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::is called`
  );
  try {
    let matchStage = {
      $match: {
        isDeleted: false,
      },
    };

    if (studentId) {
      matchStage.$match['studentId'] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      matchStage.$match['courseId'] = mongoose.Types.ObjectId(courseId);
    }

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

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await FavoritesModel.aggregate(query);

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const findFavoriteHasConditions = async ({ studentId, courseId }) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::findFavoriteHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false
    };

    if (studentId) {
      conditions['studentId'] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      conditions['courseId'] = mongoose.Types.ObjectId(courseId);
    }

    const favorite = await FavoritesModel.findOne(conditions);

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoriteHasConditions::success`
    );
    return favorite;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoriteHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const createFavoriteCourse = async (info) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::createFavoriteCourse::is called`
  );
  try {
    const newFavoriteCourse = new FavoritesModel(info);

    await newFavoriteCourse.save();

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::createFavoriteCourse::success`
    );
    return newFavoriteCourse;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::createFavoriteCourse::error`,
      e
    );
    throw new Error(e);
  }
};

const mapCourseIntoFavoritesCourse = ({ courses, favoritesCourse }) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::mapCourseIntoFavoritesCourse::is called`
  );
  try {
    const result = favoritesCourse.map((favorite) => {
      const course = courses.find(
        (course) => course._id.toString() === favorite.courseId.toString()
      );

      return { ...favorite, course };
    });

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::mapCourseIntoFavoritesCourse::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::mapCourseIntoFavoritesCourse::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  getFavoritesByConditionsHasPagination,
  findFavoriteHasConditions,
  createFavoriteCourse,
  mapCourseIntoFavoritesCourse,
};
