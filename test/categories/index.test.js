const getCategoryCourseList = require('./get-category-course-list.test');
const deleteCategory = require('./delete-category.test');
const addCategory = require('./add-category.test');

module.exports = () => {
  getCategoryCourseList();
  deleteCategory();
  addCategory();
};