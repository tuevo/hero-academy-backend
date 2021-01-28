const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const StudentsConstant = require('./students.constant');
const StudentsServices = require('./students.service');
const UsersConstant = require('../users/users.constant');
const UsersServices = require('../users/users.service');
const PaginationConstant = require('../../constants/pagination.constant');

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
    let { meta } = users[0];

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

module.exports = {
  getStudentsList,
};
