const getFeedbacksTest = require("./get-Feedbacks.test");
const getCourseDetail = require("./get-course-detail.test");
const getLecturerInfoForCoursePage = require("./get-lecturer-info-for-course-page.test");
const getAll = require('./get-all.test');

module.exports = () => {
  getAll();
  getFeedbacksTest();
  getCourseDetail();
  getLecturerInfoForCoursePage();
};