const sha1 = require('sha1');
const Promise = require('bluebird');
const redis = require('../classes/redis');
const mysql = require('../classes/mysql');

module.exports = {
  goindex: function () {
    this.start()
      .then(() => this.goindex());
  },
  start: function () {
    return new Promise(function (resolve, reject) {
      mysql.getRowsFromSource(5000, function (err, data) {
        return Promise.resolve(data).each(item => {

          var jsonData = JSON.stringify(item);
          var hashed = sha1(jsonData);

          return redis.checkhash(hashed)
            .then(reply => {

              if (reply === false) {
                redis.addhash(hashed, jsonData);
                console.log('New insert: ' + hashed);
              } else {
                console.log('Already: ' + hashed);
              }

            })
            .catch(
              error => console.log('Error: ' + error)
            );
        }).then(() => resolve(true));
      });
    });
  }
};