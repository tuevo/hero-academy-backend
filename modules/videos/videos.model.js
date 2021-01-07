const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    courseId: { type: ObjectId },
    chapterId: { type: ObjectId },
    title: { type: String },
    description: { type: String },
    url: { type: String },
    numberOfViews: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const VideoModel = mongoose.model('Video', videoSchema, 'Videos');

module.exports = VideoModel;
module.exports.Model = videoSchema;
