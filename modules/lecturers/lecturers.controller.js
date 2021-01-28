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

module.exports = {
  getLecturersList,
};
