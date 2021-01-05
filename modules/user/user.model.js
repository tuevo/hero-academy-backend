const mongoose = require('mongoose');
const uuid = require('uuid');

const UserConstant = require('../user/user.constant');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String, default: null},
  passwordHash: {type: String},
  passwordSalt: {type: String},
  username: {type: String},
  fullName: {type:String, default: null},
  role: {type: Number, default: UserConstant.ROLE.USER},
  phoneNumber: {type: String, default:null},
  refreshToken: {type:String, default: uuid.v4()}
}, {timestamps: true, paranoid: true});

const UserModel = mongoose.model('User', userSchema, 'Users');

module.exports = UserModel;
module.exports.Model = userSchema;
