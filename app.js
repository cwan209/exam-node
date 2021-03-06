'use strict';
const express = require('express');
const nconf = require('nconf');
const router = require('./router');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');

nconf.argv()
  .env()
  .file({ file: './config.json' });

require("./database/db");

const app = express();
const port = nconf.get("port");
const env = nconf.get("environment");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add session
const session = require('express-session');
if (env === 'development') {
  const FileStore = require('session-file-store')(session);
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'miloandfan',
    store: new FileStore()
  }));
} else {

}

// passport.js Setup for local authentication
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializeUser')
  done(null, user.id)
});
passport.deserializeUser((id, done) => {
  console.log('deserializeUser')
  User.findById(id, (err, user) => {
    done(err, user);
  })
});

const User = require('./database/schemas/user');
passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  function(email, password, done) {
  console.log(email, password);
    User.findOne({ email: email }, async function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!await user.verifyUser(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

// Routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1',  router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));