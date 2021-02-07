const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const CoursesModel = require('./courses.model');
const CoursesConstant = require('./courses.constant');
const cloudinary = require('../../utils/cloudinary');
const FileTypesCloudDinaryConstant = require('../../constants/file-types-cloudinary.constant');

const findCourseHasConditions = async ({ lecturerId, courseId }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCourseHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };

    if (lecturerId) {
      conditions['lecturerId'] = mongoose.Types.ObjectId(lecturerId);
    }

    if (courseId) {
      conditions['_id'] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCourseHasConditions::success`
    );
    return await CoursesModel.findOne(conditions);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCourseHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const createCourse = async (courseInfo) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::createCourse::is called`);
  try {
    const newCourse = new CoursesModel(courseInfo);

    logger.info(`${CoursesConstant.LOGGER.SERVICE}::createCourse::success`);
    return newCourse.save();
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.SERVICE}::createCourse::error`, e);
    throw new Error(e);
  }
};

const updateCourse = async ({ course, updateInfo }) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::updateCourse::is called`);
  try {
    let isChange = false;

    if (updateInfo.categoryId) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update categoryId`
      );
      course['categoryId'] = updateInfo.categoryId;
      isChange = true;
    }

    if (updateInfo.title) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update title`
      );
      course['title'] = updateInfo.title;
      isChange = true;
    }

    if (updateInfo.description) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update description`
      );
      course['description'] = updateInfo.description;
      isChange = true;
    }

    if (updateInfo.content) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update content`
      );
      course['content'] = updateInfo.content;
      isChange = true;
    }

    if (updateInfo.tuition) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update tuition`
      );
      course['content'] = updateInfo.content;
      course['tuition'] = updateInfo.tuition;
      isChange = true;
    }

    if (updateInfo.discountPercent) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update discountPercent`
      );
      course['discountPercent'] = updateInfo.discountPercent;
      isChange = true;
    }

    if (updateInfo.thumbnail) {
      if (course['publicId']) {
        logger.info(
          `${CoursesConstant.LOGGER.SERVICE}::updateCourse::remove image`
        );
        await cloudinary.deleteFile(course['publicId']);
      }

      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update image`
      );
      const thumbnailInfo = await cloudinary.uploadByBuffer(
        updateInfo.thumbnail,
        FileTypesCloudDinaryConstant.image
      );
      course['thumbnailUrl'] = thumbnailInfo.url;
      course['publicId'] = thumbnailInfo.public_id;
      isChange = true;
    }

    if (isChange) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update course`
      );
      return await course.save();
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateCourse:: course not change`
    );
    return course;
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.SERVICE}::updateCourse::error`, e);
    throw new Error(e);
  }
};

const findCoursesByIds = (coursesId) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::is called`);
  try {
    const courses = CoursesModel.find({ _id: { $in: coursesId } });

    logger.info(`${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::success`);
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::error`,
      e
    );
    throw new Error(e);
  }
};

const getCoursesByConditionsHasPagination = async ({
  limit,
  page,
  keyword,
  categoryId,
  isSortUpAscending,
  sortBy,
  lecturerId,
}) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::getCoursesByConditionsHasPagination::is called`
  );
  try {
    let matchStage = {
      $match: {
        isDeleted: false,
      },
    };

    if (lecturerId) {
      matchStage.$match['lecturerId'] = mongoose.Types.ObjectId(lecturerId);
    }

    if (categoryId) {
      matchStage.$match['categoryId'] = mongoose.Types.ObjectId(categoryId);
    }

    if (keyword) {
      matchStage.$match['$or'] = [
        {
          title: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          content: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    let sortStage = {
      $sort: {},
    };

    if (sortBy) {
      sortStage.$sort[sortBy] = isSortUpAscending ? 1 : -1;
    } else {
      sortStage.$sort['averageRating'] = isSortUpAscending ? 1 : -1;
    }

    const facetStage = {
      $facet: {
        entries: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }],
      },
    };

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getRegistrationsHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await CoursesModel.aggregate(query);

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getRegistrationsHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesByConditionsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfRegistrations = async ({ courseId, cumulativeValue }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfRegistrations::is called`
  );
  try {
    const condition = { $inc: { numberOfRegistrations: cumulativeValue } };

    await CoursesModel.updateOne(
      { _id: mongoose.Types.ObjectId(courseId) },
      condition
    );

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfRegistrations::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfRegistrations::error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfViews = async ({ courseId, cumulativeValue }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfViews::is called`
  );
  try {
    const condition = { $inc: { numberOfViews: cumulativeValue } };

    await CoursesModel.updateOne(
      { _id: mongoose.Types.ObjectId(courseId) },
      condition
    );

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfViews::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfViews::error`,
      e
    );
    throw new Error(e);
  }
};

const getCoursesListForHomePage = async ({
  startDate,
  endDate,
  limit,
  findBy,
  isSortUpAscending,
  isSortCreatedAt,
  isCreatedAtSortUpAscending,
}) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::is called`
  );
  try {
    let sortStage = {};
    let conditions = {};

    if (findBy) {
      sortStage[findBy] = isSortUpAscending ? 1 : -1;
    }

    if (isSortCreatedAt) {
      sortStage['createdAt'] = isCreatedAtSortUpAscending ? 1 : -1;
    }

    if (startDate && endDate) {
      conditions['createdAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::query`,
      JSON.stringify(conditions),
      JSON.stringify(sortStage)
    );

    const courses = await CoursesModel.find(conditions)
      .sort(sortStage)
      .limit(limit);

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::success`
    );
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::error`,
      e
    );
    throw new Error(e);
  }
};

const getCategoryWithTheMostEnrollmentCourses = async (limit) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::is called`
  );
  try {
    const projectStage = {
      $project: {
        categoryId: 1,
        numberOfRegistrations: 1,
      },
    };

    const sortStage = {
      $sort: {
        categoryId: -1,
      },
    };

    const groupStage = {
      $group: {
        _id: '$categoryId',
        totalRegistration: {
          $sum: '$numberOfRegistrations',
        },
      },
    };

    const sortStage1 = {
      $sort: {
        totalRegistration: -1,
      },
    };

    const limitStage = {
      $limit: limit,
    };

    const query = [projectStage, sortStage, groupStage, sortStage1, limitStage];
    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::query`,
      JSON.stringify(query)
    );
    const result = await CoursesModel.aggregate(query);

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::error`,
      e
    );
    throw new Error(e);
  }
};

const findCoursesHasConditions = async ({
  lecturerId,
  courseId,
  categoryId,
  sortBy,
  isSortUpAscending,
  limit,
}) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };
    let sortStage = {};

    if (lecturerId) {
      conditions['lecturerId'] = mongoose.Types.ObjectId(lecturerId);
    }

    if (courseId) {
      conditions['_id'] = mongoose.Types.ObjectId(courseId);
    }

    if (categoryId) {
      conditions['categoryId'] = mongoose.Types.ObjectId(categoryId);
    }

    if (sortBy) {
      sortStage[sortBy] = isSortUpAscending ? 1 : -1;
    }

    if (sortBy && limit) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::find by sort and limit success`
      );
      return await CoursesModel.find(conditions).sort(sortStage).limit(limit);
    }

    if (sortBy) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::find by sort success`
      );
      return await CoursesModel.find(conditions).sort(sortStage);
    }

    if (limit) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::find by limit success`
      );
      return await CoursesModel.find(conditions).limit(limit);
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::success`
    );
    return await CoursesModel.find(conditions);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findCourseHasConditions,
  createCourse,
  updateCourse,
  findCoursesByIds,
  getCoursesByConditionsHasPagination,
  updateNumberOfRegistrations,
  getCoursesListForHomePage,
  updateNumberOfViews,
  getCategoryWithTheMostEnrollmentCourses,
  findCoursesHasConditions,
};
