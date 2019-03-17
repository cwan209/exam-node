'use strict';

const express = require('express');
const nconf = require('nconf');
const router = require('./router');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

nconf.argv()
  .env()
  .file({ file: './config.json' });

require("./database/db");

const app = express();
const port = nconf.get("port");
const env = nconf.get("development");

app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add session
const expressSession = require('express-session');
if (env === 'development') {
  const FileStore = require('session-file-store')(expressSession);
  app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'miloandfan',
    store: new FileStore()
  }));
} else {

}

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1',  router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));