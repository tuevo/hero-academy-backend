const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    studentId: { type: ObjectId },
    courseId: { type: ObjectId },
  },
  { timestamps: true, paranoid: true }
);

const FavoriteModel = mongoose.model('Favorite', favoriteSchema, 'Favorites');

module.exports = FavoriteModel;
module.exports.Model = favoriteSchema;
