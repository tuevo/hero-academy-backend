const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  'SG.iOfGDKHtTcyTYKUAWtvRTA.RzUYDKGqe3fzTteGPEkkBefCQUME_s3ONNUfyAupD-s'
);
const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');

const sendConfirmMail = ({ email, fullName, otpCode }) => {
  logger.info('sendConfirmMail::is called');
  try {
    const msg = {
      from: 'abc040898.vt@gmail.com',
      to: email,
      subject: 'Online-Academy - Xác nhận đăng kí',
      text: `Xin chào ${fullName}\n\nOnline-Academy xin gửi đến bạn mã xác nhận mail: ${otpCode}.`,
    };

    sgMail
      .send(msg)
      .then(() => {
        logger.info('sendConfirmMail::success');
        return;
      })
      .catch((error) => {
        logger.error('sendConfirmMail::error', error);
        throw new Error(error);
      });
  } catch (e) {
    logger.error('sendConfirmMail::error', e);
    throw new Error(e);
  }
};

module.exports = {
  sendConfirmMail,
};
