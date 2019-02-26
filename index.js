'use strict';

const express = require('express');
const nconf = require('nconf');
const router = require('./router');

nconf.argv()
  .env()
  .file({ file: './config.json' });

require("./database/db");

const app = express();
const port = nconf.get("port");

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));