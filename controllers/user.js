const signup = function (req, res) {

  console.log('signup', req.body);

  res.send('About birds');
};

exports.signup = signup;