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
    if (user && user.verified) return res.status(400).send({success: false, error: `User ${email} already exist`});

    const verificationToken = md5(email + Date.now());

    // Send Email
    mailer.sendAccountVerificationEmail(email, verificationToken)
      .then(async response => {
        console.log('response', response);

        if (user && !user.verified) {
          user.verificationToken = verificationToken;
          const result = await user.save();
          return res.status(200).send({success: true, user: result});

        } else {
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
        }

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

const verify = async function (req, res) {
  const {email, verificationToken} = req.body;

  if (!email || !verificationToken) return res.status(400).send({
    success: false,
    error: `Invalid request`
  });

  if (!validator.isEmail(email)) return res.status(400).send({
    success: false,
    error: `This is not a valid email`
  });

  try {
    // Check User
    const user = await User.findOne({email: email, verificationToken: verificationToken});
    if (!user) return res.status(400).send({
      success: false,
      error: `User not found`
    });

    user.verified = true;
    await user.save();

    return res.status(200).send({
      success: true,
      user: user
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error
    });
  }
};

exports.verify = verify;