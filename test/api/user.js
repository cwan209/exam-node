var assert = require('assert');
const request = require('request');
const User = require('../../database/schemas/user');
const nconf = require('nconf');
var expect = require('chai').expect;
var rp = require('request-promise');

describe('User', function () {
  // this.timeout(15000);

  describe('/signup', function () {
    let email;

    before(function () {
      // runs before all tests in this block
      email = createRandomName();
    });

    it('should create a new user in database', function (done) {
      const options = {
        url: `${nconf.get('app_api_url')}v1/signup`,
        method: 'POST',
        json: true,
        body: {
          email: email,
          password: "password"
        }
      };

      rp(options)
      .then(function (res) {
        expect(res.result.email).to.equal(email);
        done();
      }).catch(function (err) {
        done(err);
      });

    });


    it('should block a the user with the same email', function () {

    });
  });
})
;

createRandomName = () => {
  return `exam_backend_${new Date().getTime()}_${(Math.random() * 10000).toFixed()}`;
};