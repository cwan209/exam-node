'use strict';

const express = require('express');
const nconf = require('nconf');
const router = require('./router');
const bodyParser = require('body-parser');
const multer = require('multer');

nconf.argv()
  .env()
  .file({ file: './config.json' });

require("./database/db");

const app = express();
const port = nconf.get("port");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));