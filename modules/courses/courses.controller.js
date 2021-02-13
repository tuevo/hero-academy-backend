const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");
const slug = require("slug");

const CoursesConstant = require("./courses.constant");
const CoursesServices = require("./courses.service");
const CategoriesServices = require("../categories/categories.service");
const Cloudinary = require("../../utils/cloudinary");
const FileTypesCloudinaryConstant = require("../../constants/file-types-cloudinary.constant");
const AdminServices = require("../admins/admins.service");
const LecturersServices = require("../lecturers/lecturers.service");
const PaginationConstant = require("../../constants/pagination.constant");
const RegistrationServices = require("../registrations/registrations.service");
const UsersServices = require("../users/users.service");
const Services = require("../../services/services");
const CategoryClusterServices = require("../category-clusters/category-clusters.service");
const FavoritesServices = require("../favorites/favorites.service");

const addCourse = async (req, res, next) => {
  logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::addCourse::is called`);
  try {
    const {
      categoryId,
      title,
      description,
      content,
      tuition,
      discountPercent,
    } = req.body;
    const roleInfo = req.user.roleInfo || null;
    const thumbnail = req.files.thumbnail[0] || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [CoursesConstant.MESSAGES.ADD_COURSE.LECTURER_NOT_FOUND],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::addCourse::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const category = await CategoriesServices.getCategoryById(categoryId);

    if (!category) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [CoursesConstant.MESSAGES.ADD_COURSE.CATEGORY_NOT_FOUND],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::addCourse::category not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const imageInfo = await Cloudinary.uploadByBuffer(
      thumbnail,
      FileTypesCloudinaryConstant.image
    );

    const newCourse = {
      categoryId,
      title,
      description,
      content,
      tuition: tuition || 0,
      discountPercent: discountPercent || 0,
      lecturerId: roleInfo._id,
      thumbnailUrl: imageInfo.url,
      publicId: imageInfo.public_id,
      slug: slug(title + " " + category.name),
    };

    const course = await CoursesServices.createCourse(newCourse);
    await AdminServices.updateNumberOfCourses(1);
    await LecturersServices.updateNumberOfCoursesPosted({
      lecturerId: course["lecturerId"],
      cumulativeValue: 1,
    });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [CoursesConstant.MESSAGES.ADD_COURSE.COURSE_ADDED_SUCCESSFULLY],
      data: {
        course,
      },
    };

    logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::addCourse::success`);
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.CONTROLLER}::addCourse::error`, e);
    return next(e);
  }
};

const getCourseDetail = async (req, res, next) => {
  logger.info(
    `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::is called`
  );
  try {
    let course = req.course;
    const { user } = req;
    const roleInfo = !user ? null : user.roleInfo;
    let isUpdate = true;
    let isFavorite = false;
    let responseData = null;

    if (roleInfo && roleInfo._id) {
      const registration = await RegistrationServices.findRegistrationsHasConditions(
        { studentId: roleInfo._id, courseId: course._id }
      );
      const favorite = await FavoritesServices.findFavoriteHasConditions({
        studentId: roleInfo._id,
        courseId: course.id,
      });

      if (registration) isUpdate = false;
      if (favorite) isFavorite = true;
    }

    const role = await LecturersServices.findLecturerById(course.lecturerId);

    if (!role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CoursesConstant.MESSAGES.GET_COURSE_DETAIL.LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const userInfo = await UsersServices.findUserById(role.userId);

    if (!userInfo) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CoursesConstant.MESSAGES.GET_COURSE_DETAIL.LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::user not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    course["numberOfViews"] = course["numberOfViews"] + 1;
    isUpdate && (await course.save());
    course = JSON.parse(JSON.stringify(course));
    course["isRegistered"] = !isUpdate;
    course["isFavorite"] = isFavorite;
    course["lecturer"] = {
      ...Services.deleteFieldsUser(userInfo),
      roleInfo: role,
    };

    const mostRegisteredCourses = await CoursesServices.findCoursesHasConditions(
      {
        categoryId: course.categoryId,
        sortBy: "numberOfRegistrations",
        isSortUpAscending: false,
        limit: 10,
      }
    );
    const categories = await CategoriesServices.getCategoriesByIds([
      course.categoryId,
    ]);

    const categoryClustersId = categories.map(
      (category) => category.categoryClusterId
    );
    const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
      categoryClustersId
    );

    course = Services.mapDataIntoCourse({
      courses: [course],
      categories,
      categoryClusters,
      lecturers: [],
      users: [],
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.GET_COURSE_DETAIL
          .GET_COURSE_DETAIL_SUCCESSFULLY,
      ],
      data: {
        course: course[0],
        mostRegisteredCourses,
      },
    };

    logger.info(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCourseDetail::error`,
      e
    );
    return next(e);
  }
};

const updateCourse = async (req, res, next) => {
  logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::is called`);
  try {
    let course = req.course;
    const { files } = req;
    let thumbnail = null;
    const {
      categoryId,
      title,
      description,
      content,
      tuition,
      discountPercent,
    } = req.body;
    let responseData = null;

    if (files && Object.keys(files).length !== 0) {
      thumbnail = files["thumbnail"][0];
    }

    if (categoryId) {
      const category = await CategoriesServices.getCategoryById(categoryId);

      if (!category) {
        responseData = {
          status: HttpStatus.NOT_FOUND,
          messages: [CoursesConstant.MESSAGES.UPDATE_COURSE.CATEGORY_NOT_FOUND],
        };

        logger.info(
          `${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::category not found`
        );
        return res.status(HttpStatus.NOT_FOUND).json(responseData);
      }
    }

    const updateInfo = {
      categoryId,
      title,
      description,
      content,
      tuition,
      discountPercent,
      thumbnail,
    };

    course = await CoursesServices.updateCourse({ course, updateInfo });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.UPDATE_COURSE.SUCCESSFUL_UPDATED_COURSE,
      ],
      data: {
        course,
      },
    };

    logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::updateCourse::error`,
      e
    );
    return next(e);
  }
};

const deleteCourse = async (req, res, next) => {
  logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::deleteCourse::is called`);
  try {
    const course = req.course;
    let responseData = null;

    course["isDeleted"] = true;
    await course.save();
    await AdminServices.updateNumberOfCourses(-1);
    await LecturersServices.updateNumberOfCoursesPosted({
      lecturerId: course["lecturerId"],
      cumulativeValue: -1,
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [],
    };

    logger.info(`${CoursesConstant.LOGGER.CONTROLLER}::deleteCourse::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::deleteCourse::error`,
      e
    );
    return next(e);
  }
};

const getCoursesListByLecturer = async (req, res, next) => {
  logger.info(
    `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByLecturer::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CoursesConstant.MESSAGES.GET_COURSES_LIST_BY_LECTURER
            .LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByLecturer::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const courses = await CoursesServices.getCoursesByConditionsHasPagination({
      limit,
      page,
      keyword: null,
      isSortUpAscending: null,
      sortBy: null,
      lecturerId: roleInfo._id,
      categoryId: null,
    });

    let { entries } = courses[0];
    const meta =
      courses[0].meta.length > 0
        ? courses[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length > 0) {
      const categoriesId = entries.map((course) => course.categoryId);
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const users = await UsersServices.getUsersByIds([req.user._id]);

      const lecturers = await LecturersServices.getLecturersByIds([
        roleInfo._id,
      ]);

      entries = Services.mapDataIntoCourse({
        courses: entries,
        categories,
        categoryClusters,
        lecturers,
        users,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.GET_COURSES_LIST_BY_LECTURER
          .GET_COURSES_LIST_BY_LECTURER_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByLecturer::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByLecturer::error`,
      e
    );
    return next(e);
  }
};

const getCoursesListByCategory = async (req, res, next) => {
  logger.info(
    `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCategory::is called`
  );
  try {
    const { categoryId } = req.params;
    const { user } = req;
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = !user ? null : user.roleInfo;
    let roleId = null;
    let responseData = null;

    if (roleInfo && roleInfo._id) {
      roleId = roleInfo._id;
    }

    const category = await CategoriesServices.getCategoryById(categoryId);

    if (!category) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CoursesConstant.MESSAGES.GET_COURSES_LIST_BY_CATEGORY
            .CATEGORY_NOT_FOUND,
        ],
      };

      logger.info(
        `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCategory::category not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const courses = await CoursesServices.getCoursesByConditionsHasPagination({
      limit,
      page,
      keyword: null,
      isSortUpAscending: null,
      sortBy: null,
      lecturerId: null,
      categoryId,
    });

    let { entries } = courses[0];
    const meta =
      courses[0].meta.length > 0
        ? courses[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };
    let categoryClusters = [];

    if (entries.length > 0) {
      categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        [category.categoryClusterId]
      );

      const lecturersId = entries.map((course) => course.lecturerId);
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      entries = Services.mapDataIntoCourse({
        courses: entries,
        categories: [category],
        categoryClusters,
        lecturers,
        users,
      });

      entries = await CoursesServices.mapIsRegisteredFieldIntoCourses({
        roleId,
        courses: entries,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.GET_COURSES_LIST_BY_CATEGORY
          .GET_COURSES_LIST_BY_CATEGORY_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
        category: {
          ...JSON.parse(JSON.stringify(category)),
          categoryCluster:
            categoryClusters.length > 0 ? categoryClusters[0] : null,
        },
      },
    };

    logger.info(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCategory::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCategory::error`,
      e
    );
    return next(e);
  }
};

const getCoursesListByCriteria = async (req, res, next) => {
  logger.info(
    `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCriteria::is called`
  );
  try {
    const { keyword, isSortUpAscending, sortBy } = req.query;
    const { user } = req;
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = !user ? null : user.roleInfo;
    let roleId = null;
    let responseData = null;

    if (roleInfo && roleInfo._id) {
      roleId = roleInfo._id;
    }

    const courses = await CoursesServices.getCoursesByConditionsHasPagination({
      limit,
      page,
      keyword,
      isSortUpAscending,
      sortBy,
    });

    let { entries } = courses[0];
    const meta =
      courses[0].meta.length > 0
        ? courses[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length > 0) {
      const categoriesId = entries.map((course) => course.categoryId);
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const lecturersId = entries.map((course) => course.lecturerId);
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      entries = Services.mapDataIntoCourse({
        courses: entries,
        categories,
        categoryClusters,
        lecturers,
        users,
      });

      entries = await CoursesServices.mapIsRegisteredFieldIntoCourses({
        roleId,
        courses: entries,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CoursesConstant.MESSAGES.GET_COURSES_LIST_BY_CRITERIA
          .GET_COURSES_LIST_BY_CRITERIA_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCriteria::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.CONTROLLER}::getCoursesListByCriteria::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  addCourse,
  getCourseDetail,
  updateCourse,
  deleteCourse,
  getCoursesListByLecturer,
  getCoursesListByCategory,
  getCoursesListByCriteria,
};
