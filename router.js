const express = require('express');
const router = express.Router();
const user = require('./controllers/user');
const passport = require('passport');

router.post('/signup', user.signup);
router.post('/verify', user.verify);
router.get('/session', user.session);

router.post('/login',passport.authenticate('local',{
  session: false
}), user.login);

router.post('/logout', user.logout);

module.exports = router;