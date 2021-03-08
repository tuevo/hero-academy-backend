const addCategoryCluster = require('./add-category-cluster.test');
const getCategoryClustersInfo = require('./get-category-clusters-info.test');

module.exports = () => {
  addCategoryCluster();
  getCategoryClustersInfo();
};