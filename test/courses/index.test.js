const getFeedbacksTest = require("./get-Feedbacks.test");
const getCourseDetail = require("./get-course-detail.test");
const getLecturerInfoForCoursePage = require("./get-lecturer-info-for-course-page.test");

module.exports = () => {
    getFeedbacksTest();
    getCourseDetail();
    getLecturerInfoForCoursePage();
};