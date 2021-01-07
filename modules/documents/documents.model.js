const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    title: { type: String },
    link: { type: String },
    courseId: { type: ObjectId },
  },
  { timestamps: true, paranoid: true }
);

const DocumentModel = mongoose.model('Document', documentSchema, 'Documents');

module.exports = DocumentModel;
module.exports.Model = documentSchema;
