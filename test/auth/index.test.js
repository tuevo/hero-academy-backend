const loginTest = require("./login.test");
const registerTest = require("./register.test");
const changePassTest = require("./changePass.test");
const sendOtpCode = require('./send-otp-code.test');
const confirmAccount = require('./confirm-account.test');

module.exports = () => {
  loginTest();
  sendOtpCode();
  confirmAccount();
  //registerTest();
  //changePassTest();
};
