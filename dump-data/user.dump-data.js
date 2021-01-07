const log4js = require('log4js');
const logger = log4js.getLogger('App');
const bcrypt = require('bcrypt');

const DumpDataConstant = require('../constants/dump-data.constant');
const LoggerConstant = require('../constants/logger.constant');
const UserModel = require('../modules/users/users.model');
const UserConstant = require('../modules/users/users.constant');
const AdminsModel = require('../modules/admins/admins.model');
const AdminsService = require('../modules/admins/admins.service');

const createUsers = () => {
  const dumpData = async () => {
    logger.info(
      `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::is called`
    );
    try {
      const users = DumpDataConstant.USER.usersInfo;
      const config = DumpDataConstant.USER.userDetail;

      await Promise.all(
        users.map(async (fullName) => {
          let user = await UserModel.findOne({ fullName }).lean();

          if (!user) {
            logger.info(
              `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUser::creating ${fullName}`
            );

            let userInfo = config[fullName];
            const salt = bcrypt.genSaltSync(UserConstant.SALT_LENGTH);
            userInfo.passwordSalt = salt;
            userInfo.passwordHash = bcrypt.hashSync('123456789', salt);

            user = new UserModel(userInfo);
            await user.save();
          }

          const admin = await AdminsService.findAdminByUserId(user._id);

          if (!admin) {
            const newAdmin = new AdminsModel({
              userId: user._id,
            });

            logger.info(
              `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createAdmin::creating admin by id ${user._id}`
            );

            await newAdmin.save();
          }
        })
      );

      logger.info(
        `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::Done`
      );
      return;
    } catch (e) {
      logger.error(
        `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::error`,
        e
      );
      throw new Error(e);
    }
  };

  dumpData();
};

module.exports = async () => {
  await createUsers();
};
