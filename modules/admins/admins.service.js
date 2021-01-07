const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');
const mongoose = require('mongoose');

const AdminsModel = require('./admins.model');
const AdminsConstant = require('./admins.constant');

const findAdminByUserId = async (userId) => {
  logger.info(`${AdminsConstant.LOGGER.SERVICE}::findAdminByUserId::is called`);
  try {
    logger.info(`${AdminsConstant.LOGGER.SERVICE}::findAdminByUserId::success`);

    return await AdminsModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });
  } catch (e) {
    logger.error(
      `${AdminsConstant.LOGGER.SERVICE}::findAdminByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findAdminByUserId,
};
