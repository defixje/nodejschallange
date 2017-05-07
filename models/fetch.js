const sha1 = require('sha1');
const bluebird = require('bluebird');
const redis = require('../classes/redis');
const mysql = require('../classes/mysql');

module.exports = {
  goindex: function () {
    this.start();
  },
  start: function () {


    mysql.getrowsfromsource(500, function (err, data) {
      return bluebird.resolve(data).each(item => {

        var jsondata = JSON.stringify(data);
        var hashed = sha1(jsondata);

        return redis.checkhash(hashed, jsondata)
          .then(reply => {

            if (reply === null) {
              redis.addhash(hashed, jsondata);
              console.log('New insert: ' + hashed);
            } else {
              console.log('Already: ' + hashed);
            }

          });
      }).then(() => resolve(true));
    });

  }
};