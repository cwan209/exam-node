'use strict';

const express = require('express');
const nconf = require('nconf');

nconf.argv()
  .env()
  .file({ file: './config.json' });

const app = express();
const port = nconf.get("port");

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))