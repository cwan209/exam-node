const express = require('express');
const router = express.Router();
const user = require('./controllers/user');

router.post('/signup', user.signup);
router.post('/verify', user.verify);

module.exports = router;