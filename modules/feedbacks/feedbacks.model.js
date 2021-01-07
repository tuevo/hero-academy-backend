const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    studentId: { type: ObjectId },
    courseId: { type: ObjectId },
    content: { type: String },
  },
  { timestamps: true, paranoid: true }
);

const FeedBackModel = mongoose.model('feedback', feedbackSchema, 'feedbacks');

module.exports = FeedBackModel;
module.exports.Model = feedbackSchema;
