const User = require('../database/schemas/user');
const bcrypt = require('bcrypt');
var validator = require('validator');

validator.isEmail('foo@bar.com');
const signup = async function (req, res) {
  const {email, password} = req.body;
  const saltRounds = 10;

  try {
    // Check Email
    if(!validator.isEmail(email)) return res.status(400).send(`This is not a valid email`);

    // Check User
    const user = await User.findOne({ email: email});
    if (user) return res.status(400).send(`User ${email} already exist`);

    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    const newUser = new User({ email: email, password: hashedPassword});
    const result = await newUser.save();

    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};
exports.signup = signup;