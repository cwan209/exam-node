const mongoose = require('mongoose');
const nconf = require('nconf');

const mongodbPort = nconf.get("mongodbPort");
mongoose.connect(`mongodb://localhost/${mongodbPort}`, () => console.log(`connected to mongoDB at ${mongodbPort}`));