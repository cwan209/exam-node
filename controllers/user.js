const User = require('../database/schemas/user');
const signup = async function (req, res) {

  const {email, password} = req.body;

  try {
    const user = await User.findOne({ email: email});
    if (user) return res.status(400).send(user);

    const newUser = new User({ email: email, password:  password});
    const result = await newUser.save();
    return res.status(201).send({
      success: true,
      result: result
    });

  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.signup = signup;