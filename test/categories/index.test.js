const getCategoryCourseList = require('./get-category-course-list.test');
const deleteCategory = require('./delete-category.test');
const addCategory = require('./add-category.test');
const updateCategory = require('./update-category.test');

module.exports = () => {
  getCategoryCourseList();
  deleteCategory();
  addCategory();
  updateCategory();
};