const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:  String,
  email: String,
  password: String,
  verificationToken: String,
  verified: Boolean
});

userSchema.index({email: 1});

const User = mongoose.model('User', userSchema);

module.exports = User;