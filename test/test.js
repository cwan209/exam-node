require('./api/user');

const nconf = require('nconf');
nconf.argv()
  .env()
  .file({ file: './config.json' });
