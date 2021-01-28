const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const LecturersConstant = require('./lecturers.constant');
const LecturersServices = require('./lecturers.service');
const UsersConstant = require('../users/users.constant');
const UsersServices = require('../users/users.service');
const PaginationConstant = require('../../constants/pagination.constant');
const Services = require('../../services/services');

const getLecturersList = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::getLecturersList::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    let responseData = null;

    const users = await UsersServices.findUsersByRoleHasPagination({
      role: UsersConstant.ROLE.LECTURER,
      page,
      limit,
    });

    let { entries } = users[0];
    let { meta } = users[0];

    if (entries.length > 0) {
      const usersId = entries.map((user) => user._id);
      const lecturers = await LecturersServices.getLecturersByUsersId(usersId);

      entries = LecturersServices.mapLecturersIntoUsers({
        users: entries,
        lecturers,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.GET_LECTURERS_LIST
          .GET_LECTURERS_LIST_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturersList::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturersList::error`,
      e
    );
    return next(e);
  }
};

const getLecturerDetail = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::is called`
  );
  try {
    const { lecturerId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(lecturerId);
    const role = await LecturersServices.findLecturerByUserId(lecturerId);

    console.log(role);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          LecturersConstant.MESSAGES.GET_LECTURER_DETAIL.LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.GET_LECTURER_DETAIL
          .GET_LECTURER_DETAIL_SUCCESSFULLY,
      ],
      data: {
        student: {
          ...Services.deleteFieldsUser(user),
          roleInfo: role,
        },
      },
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::error`,
      e
    );
    return next(e);
  }
};

const deleteLecturer = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::is called`
  );
  try {
    const { lecturerId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(lecturerId);
    const role = await LecturersServices.findLecturerByUserId(lecturerId);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          LecturersConstant.MESSAGES.DELETE_LECTURER.LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    user['isDeleted'] = true;
    role['isDeleted'] = true;
    await user.save();
    await role.save();

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.DELETE_LECTURER
          .DELETED_LECTURER_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getLecturersList,
  getLecturerDetail,
  deleteLecturer,
};
