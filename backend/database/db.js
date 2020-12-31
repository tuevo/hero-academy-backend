const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger('app');

module.exports = (callback) => {
  mongoose.connect(
    process.env.DATABASE_URL ||
      'mongodb+srv://trackingClick:abcd-12345@cluster0.sfdzj.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err) => {
      if (err) {
        logger.error("APP::Connection DB::Can't connection DB");
        throw new Error(err);
      } else {
        callback();
      }
    }
  );
};
