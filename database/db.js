const mongoose = require('mongoose');
const nconf = require('nconf');

const mongodbPort = nconf.get("mongodbPort");
mongoose.connect(`mongodb://localhost/${mongodbPort}`, () => console.log(`connected to mongoDB at ${mongodbPort}`));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected!')
  // we're connected!
});