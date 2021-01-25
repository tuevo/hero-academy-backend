const mongoose = require('mongoose');
const uuid = require('uuid');

const UserConstant = require('./users.constant');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, default: null },
    passwordHash: { type: String, default: null },
    passwordSalt: { type: String, default: null },
    otpCode: { type: String, default: null },
    fullName: { type: String, default: null },
    role: { type: Number, default: UserConstant.ROLE.STUDENT },
    avatarUrl: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    isConfirmed: { type: Boolean, default: false },
    refreshToken: { type: String, default: uuid.v4() },
    publicId: { type: String, default: null },
  },
  { timestamps: true, paranoid: true }
);

const UserModel = mongoose.model('User', userSchema, 'Users');

module.exports = UserModel;
module.exports.Model = userSchema;
