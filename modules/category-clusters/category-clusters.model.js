const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const categoryClusterSchema = new Schema(
  {
    categoryId: { type: ObjectId },
    name: { type: String },
    numberOfCourses: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const CategoryClusterModel = mongoose.model(
  'CategoryCluster',
  categoryClusterSchema,
  'CategoryClusters'
);

module.exports = CategoryClusterModel;
module.exports.Model = categoryClusterSchema;
