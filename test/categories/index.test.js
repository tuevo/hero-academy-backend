const getCategoryCourseList = require('./get-category-course-list.test');
const deleteCategory = require('./delete-category.test');

module.exports = () => {
  getCategoryCourseList();
  deleteCategory();
};