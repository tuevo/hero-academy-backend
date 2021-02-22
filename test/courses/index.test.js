const getFeedbacksTest = require("./get-Feedbacks.test");
const getCourseDetail = require("./get-course-detail.test");
const getLecturerInfoForCoursePage = require("./get-lecturer-info-for-course-page.test");
const getCourseList = require('./get-course-list.test');

module.exports = () => {
  getCourseList();
  getFeedbacksTest();
  getCourseDetail();
  getLecturerInfoForCoursePage();
};