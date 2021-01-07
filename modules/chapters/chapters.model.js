const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const chapterSchema = new Schema(
  {
    courseId: { type: ObjectId },
    title: { type: String },
    numberOfVideos: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const ChapterModel = mongoose.model('Chapter', chapterSchema, 'Chapters');

module.exports = ChapterModel;
module.exports.Model = chapterSchema;
