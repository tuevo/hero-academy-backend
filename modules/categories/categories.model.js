const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String },
  },
  { timestamps: true, paranoid: true }
);

const CategoryModel = mongoose.model('Category', categorySchema, 'Categories');

module.exports = CategoryModel;
module.exports.Model = categorySchema;
