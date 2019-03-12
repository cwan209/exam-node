const User = require('../database/schemas/user');
const bcrypt = require('bcrypt');
var validator = require('validator');
const mailer = require('../helper/mailer');
var md5 = require('md5');

const signup = async function (req, res) {
  const {email, password, name} = req.body;
  const saltRounds = 10;

  try {
    if (!email || !password || !name) return res.status(400).send({
      success: false,
      error: `Please make sure all of the following fields are provided: email, password, name`
    });
    // Check Email
    if (!validator.isEmail(email)) return res.status(400).send({success: false, error: `This is not a valid email`});

    // Check User
    const user = await User.findOne({email: email});
    if (user) return res.status(400).send({success: false, error: `User ${email} already exist`});

    const verificationToken = md5(email + Date.now());
    // Send Email
    mailer.sendAccountVerificationEmail(email, verificationToken)
      .then(async response => {
        console.log('response', response);

        const hashedPassword = await bcrypt.hashSync(password, saltRounds);
        const newUser = new User({
          email: email,
          password: hashedPassword,
          name: name,
          verificationToken: verificationToken,
          verified: false
        });
        const result = await newUser.save();

        return res.status(201).send({success: true, user: result});
      })
      .catch(error => {
          return res.status(error.responseCode).send({success: false, error: error.response});
        }
      );
  } catch (error) {
    return res.status(500).send({success: false, error: error});
  }
};

exports.signup = signup;