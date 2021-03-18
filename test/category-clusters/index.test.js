const addCategoryCluster = require('./add-category-cluster.test');
const updateCategoryCluster = require('./update-category-cluster.test');

module.exports = () => {
  addCategoryCluster();
  updateCategoryCluster();
};