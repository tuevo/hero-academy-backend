const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const StudentsConstant = require("./students.constant");
const StudentsServices = require("./students.service");
const UsersConstant = require("../users/users.constant");
const UsersServices = require("../users/users.service");
const PaginationConstant = require("../../constants/pagination.constant");
const Services = require("../../services/services");
const AdminsService = require("../admins/admins.service");

const getStudentsList = async (req, res, next) => {
  logger.info(
    `${StudentsConstant.LOGGER.CONTROLLER}::getStudentsList::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    let responseData = null;

    const users = await UsersServices.findUsersByRoleHasPagination({
      role: UsersConstant.ROLE.STUDENT,
      page,
      limit,
    });

    let { entries } = users[0];
    const meta =
      users[0].meta.length > 0
        ? users[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length > 0) {
      const usersId = entries.map((user) => user._id);
      const students = await StudentsServices.getStudentsByUsersId(usersId);

      entries = StudentsServices.mapStudentsIntoUsers({
        users: entries,
        students,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        StudentsConstant.MESSAGES.GET_STUDENTS_LIST
          .GET_STUDENTS_LIST_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentsList::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentsList::error`,
      e
    );
    return next(e);
  }
};

const getStudentDetail = async (req, res, next) => {
  logger.info(
    `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::is called`
  );
  try {
    const { studentId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(studentId);
    const role = await StudentsServices.findStudentByUserId(studentId);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          StudentsConstant.MESSAGES.GET_STUDENT_DETAIL.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        StudentsConstant.MESSAGES.GET_STUDENT_DETAIL
          .GET_STUDENT_DETAIL_SUCCESSFULLY,
      ],
      data: {
        student: {
          ...Services.deleteFieldsUser(user),
          roleInfo: role,
        },
      },
    };

    logger.info(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::error`,
      e
    );
    return next(e);
  }
};

const deleteStudent = async (req, res, next) => {
  logger.info(
    `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::is called`
  );
  try {
    const { studentId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(studentId);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [StudentsConstant.MESSAGES.DELETE_STUDENT.STUDENT_NOT_FOUND],
      };

      logger.info(
        `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    user["isDeleted"] = true;
    await user.save();
    await AdminsService.updateNumberOfStudents(-1);

    responseData = {
      status: HttpStatus.OK,
      messages: [
        StudentsConstant.MESSAGES.DELETE_STUDENT.DELETED_STUDENT_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getStudentsList,
  getStudentDetail,
  deleteStudent,
};
