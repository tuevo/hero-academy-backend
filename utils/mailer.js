const nodemailer = require('nodemailer');
const log4js = require('log4js');
const logger = log4js.getLogger('Sevices');

const sendConfirmMail = async ({ email, fullName, otpCode }) => {
  logger.info('sendConfirmMail::is called');
  try {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: testAccount.user,
      to: email,
      subject: 'Online-Academy - Xác nhận đăng kí',
      text: `Xin chào ${fullName}. Chúng tôi gửi bạn mã xác nhận mail ${otpCode}.`,
    });

    return info;
  } catch (e) {
    logger.error('sendConfirmMail::error', e);
    throw new Error(e);
  }
};

module.exports = {
  sendConfirmMail,
};
