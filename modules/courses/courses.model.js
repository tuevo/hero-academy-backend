const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    categoryId: { type: ObjectId },
    lecturerId: { type: ObjectId },
    thumbnailUrl: { type: String },
    title: { type: String },
    description: { type: String },
    content: { type: String },
    numberOfRatings: { type: Number, default: 0 },
    numberOfRegistrations: { type: Number, default: 0 },
    numberOfViews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    tuition: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const CourseModel = mongoose.model('Course', courseSchema, 'Courses');

module.exports = CourseModel;
module.exports.Model = courseSchema;
