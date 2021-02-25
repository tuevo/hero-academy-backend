const getStudentList = require("./get-students-list.test");
const getCoursesListRegistered = require("./get-courses-list-registered.test");

module.exports = () => {
  getStudentList();
  getCoursesListRegistered();
};
