const sgMail = require('@sendgrid/mail');
const log4js = require('log4js');
const logger = log4js.getLogger('Services');

sgMail.setApiKey(
  'SG.iOfGDKHtTcyTYKUAWtvRTA.RzUYDKGqe3fzTteGPEkkBefCQUME_s3ONNUfyAupD-s'
);

const sendConfirmMail = ({ email, fullName, otpCode }) => {
  logger.info('Utils::sendConfirmMail::is called');
  return new Promise(async (res, rej) => {
    try {
      const msg = {
        from: 'abc040898.vt@gmail.com',
        to: email,
        subject: 'Online-Academy - Xác nhận đăng kí',
        text: `Xin chào ${fullName}\n\nOnline-Academy xin gửi đến bạn mã xác nhận mail: ${otpCode}.`,
      };

      await sgMail.send(msg);

      logger.info('Utils::sendConfirmMail::success');
      return res();
    } catch (e) {
      logger.error('Utils::sendConfirmMail::error', e);
      return rej(e);
    }
  });
};

module.exports = {
  sendConfirmMail,
};
