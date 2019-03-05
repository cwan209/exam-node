var assert = require('assert');
const request = require('request');
const User = require('../../database/schemas/user');
const nconf = require('nconf');
var expect = require('chai').expect;
var rp = require('request-promise');
var _ = require('lodash');

const mongoose = require('mongoose');

describe('User', function () {
  describe('/signup', function () {
    let options;
    let email;

    before(function () {
      email = createRandomName();
      options = {
        url: `${nconf.get('app_api_url')}v1/signup`,
        method: 'POST',
        json: true,
        body: {
          email: email,
          password: "password"
        }
      };

      // runs before all tests in this block
      const mongodbPort = nconf.get("mongodbPort");
      mongoose.connect(`mongodb://localhost/${mongodbPort}`, () => console.log(`connected to mongoDB at ${mongodbPort}`));

      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function () {
        console.log('we\'re connected!')
        // we're connected!
      });
    });


    it('should block a request with invalid email', function (done) {
      const newOptions = _.cloneDeep(options);
      newOptions.body.email = 'invalidEmail';

      rp(newOptions)
        .then(function (res) {
          done(res);
        })
        .catch(function (err) {
          expect(err.statusCode).to.equal(400);
          expect(err.error).to.equal(`This is not a valid email`);
          done();
        });
    });

    it('should create a new user in database', function (done) {
      rp(options)
        .then(function (res) {
          expect(res.email).to.equal(email);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('should block a user with existing email', function (done) {
      rp(options)
        .then(function (res) {
          done(res);
        })
        .catch(function (err) {
          expect(err.statusCode).to.equal(400);
          expect(err.error).to.equal(`User ${email} already exist`);
          done();
        });
    });

    after(function (done) {
      User.deleteOne({email: email}, () => {
        mongoose.connection.close(done);
      });
    });
  });
})
;

createRandomName = () => {
  return `test_user_exam_backend_${new Date().getTime()}_${(Math.random() * 10000).toFixed()}@test.com`;
};