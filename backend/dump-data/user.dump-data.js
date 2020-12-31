const log4js = require('log4js');
const logger = log4js.getLogger('App');
const bcrypt = require('bcrypt');

const UserModel = require('../modules/user/user.model');
const UserConstant = require('../modules/user/user.constant');
const DumpDataConstant = require('../constants/dump-data.constant');
const LoggerConstant = require('../constants/logger.constant');

const createUsers = () => {
  const dumpData = async () => {
    logger.info(
      `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::is called`
    );
    try {
      const users = DumpDataConstant.USER.usersInfo;
      const config = DumpDataConstant.USER.userDetail;

      await Promise.all(
        users.map(async (username) => {
          const user = await UserModel.findOne({ username }).lean();

          if (!user) {
            logger.info(
              `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUser::creating ${username}`
            );
            let userInfo = config[username];
            const salt = bcrypt.genSaltSync(UserConstant.SALT_LENGTH);
            userInfo.passwordSalt = salt;
            userInfo.passwordHash = bcrypt.hashSync('123456789', salt);

            let newUser = new UserModel(userInfo);
            await newUser.save();
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
