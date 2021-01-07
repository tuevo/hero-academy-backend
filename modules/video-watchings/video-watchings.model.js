const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const videoWatchingSchema = new Schema(
  {
    studentId: { type: ObjectId },
    videoId: { type: ObjectId },
  },
  { timestamps: true, paranoid: true }
);

const VideoWatchingModel = mongoose.model(
  'VideoWatching',
  videoWatchingSchema,
  'VideoWatchings'
);

module.exports = VideoWatchingModel;
module.exports.Model = videoWatchingSchema;
