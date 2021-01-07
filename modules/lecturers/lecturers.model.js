const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const lecturerSchema = new Schema(
  {
    userId: { type: ObjectId, unique: true },
    introduction: { type: String, default: null },
    averageRating: { type: Number, default: 0 },
    numberOfCoursesPosted: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const LecturerModel = mongoose.model('Lecturer', lecturerSchema, 'Lecturers');

module.exports = LecturerModel;
module.exports.Model = lecturerSchema;
