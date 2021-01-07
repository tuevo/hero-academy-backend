const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    studentId: { type: ObjectId },
    courseId: { type: ObjectId },
    price: { type: Number },
  },
  { timestamps: true, paranoid: true }
);

const RatingModel = mongoose.model('Rating', ratingSchema, 'Ratings');

module.exports = RatingModel;
module.exports.Model = ratingSchema;
