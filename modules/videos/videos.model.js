const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    courseId: { type: ObjectId, default: null },
    chapterId: { type: ObjectId, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    url: { type: String, default: null },
    numberOfViews: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const VideoModel = mongoose.model('Video', videoSchema, 'Videos');

module.exports = VideoModel;
module.exports.Model = videoSchema;
