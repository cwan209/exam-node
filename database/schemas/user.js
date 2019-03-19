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

userSchema.methods.verifyPassword = async function(password) {
  console.log('verifyPassword');
  return await bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;