const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');
const moment = require('moment-timezone');

const HomeConstant = require('./home.constant');
const CoursesServices = require('../courses/courses.service');
const HomeServices = require('./home.service');
const CategoriesServices = require('../categories/categories.service');

const getCoursesListForHomePage = async (req, res, next) => {
  logger.info(
    `${HomeConstant.LOGGER.CONTROLLER}::getCoursesListForHomePage::is called`
  );
  try {
    const startDate = moment()
      .tz('Asia/Ho_Chi_Minh')
      .subtract(7, 'd')
      .startOf('day');
    const endDate = moment().tz('Asia/Ho_Chi_Minh').endOf('day');
    let responseData = null;

    const coursesListWithTheMostViews = await CoursesServices.getCoursesListForHomePage(
      {
        startDate: null,
        endDate: null,
        limit: 10,
        findBy: 'numberOfViews',
        isSortUpAscending: false,
        isSortCreatedAt: true,
        isCreatedAtSortUpAscending: false,
      }
    );
    const ListOfLatestCourses = await CoursesServices.getCoursesListForHomePage(
      {
        startDate: null,
        endDate: null,
        limit: 10,
        findBy: null,
        isSortUpAscending: null,
        isSortCreatedAt: true,
        isCreatedAtSortUpAscending: false,
      }
    );
    const outstandingCourseList = await CoursesServices.getCoursesListForHomePage(
      {
        startDate: null,
        endDate: null,
        limit: 3,
        findBy: 'averageRating',
        isSortUpAscending: false,
        isSortCreatedAt: true,
        isCreatedAtSortUpAscending: false,
      }
    );
    let mostRegisteredCategory = await CoursesServices.getCategoryWithTheMostEnrollmentCourses(
      10
    );

    if (mostRegisteredCategory.length > 0) {
      const categoriesId = mostRegisteredCategory.map(
        (category) => category._id
      );

      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );
      mostRegisteredCategory = HomeServices.mapCategoriesIntoMostRegisteredCategory(
        { categories, mostRegisteredCategory }
      );
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        HomeConstant.MESSAGE.GET_COURSER_FOR_HOME_PAGE
          .GET_COURSER_FOR_HOME_PAGE_SUCCESSFULLY,
      ],
      data: {
        coursesListWithTheMostViews,
        ListOfLatestCourses,
        outstandingCourseList,
        mostRegisteredCategory,
      },
    };

    logger.info(
      `${HomeConstant.LOGGER.CONTROLLER}::getCoursesListForHomePage::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${HomeConstant.LOGGER.CONTROLLER}::getCoursesListForHomePage::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getCoursesListForHomePage,
};
