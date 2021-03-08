const getFeedbacksTest = require("./get-Feedbacks.test");
const getCourseDetail = require("./get-course-detail.test");
const getLecturerInfoForCoursePage = require("./get-lecturer-info-for-course-page.test");
const getCourseList = require('./get-course-list.test');
const getChaptersTest = require("./get-chapters.test");
const deleteCourse = require('./delete-course.test');
const updateCourse = require('./update-course.test');
const registerCourse = require('./register-course.test');
const addCourseChapter = require('./add-course-chapter.test');
const getCourseChapterVideoList = require('./get-course-chapter-video-list.test');
const getCourseVideoWatchingList = require('./get-course-video-watching-list.test');

module.exports = () => {
  getCourseList();
  getFeedbacksTest();
  getCourseDetail();
  getLecturerInfoForCoursePage();
  getChaptersTest();
  deleteCourse();
  updateCourse();
  registerCourse();
  addCourseChapter();
  getCourseChapterVideoList();
  getCourseVideoWatchingList();
};