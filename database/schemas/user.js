const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name:  String,
  email: String,
  password: String,
  verificationToken: String,
  verified: Boolean
});

userSchema.index({email: 1});

userSchema.methods.verifyUser = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;