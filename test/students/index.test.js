const getStudentList = require("./get-students-list.test");
const deleteStudent = require('./delete-student.test');

module.exports = () => {
  getStudentList();
  deleteStudent();
};
