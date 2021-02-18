const loginTest = require("./login.test");
const registerTest = require("./register.test");

module.exports = () => {
  loginTest();
  registerTest();
};
