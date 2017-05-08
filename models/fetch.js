const sha1 = require('sha1');
const Promise = require('bluebird');
const redis = require('../classes/redis');
const mysql = require('../classes/mysql');
const push = require('./push');

module.exports = {
  goindex: function () {
    this.start()
      .then(() => {
        console.log('Leggo');
        this.goindex()
      });
  },
  start: function () {
    return new Promise((resolve, reject) => {
      const destinationdb = mysql.destinationdb();

      mysql.getRowsFromSource(15000, (err, data) => {
          return Promise.resolve(data).map(item => {

            var jsonData = JSON.stringify(item);
            var hashed = sha1(jsonData);

            return redis.checkhash(hashed)
              .then(reply => {
                // console.log('Already:', hashed);
              })
              .catch(err => {
                if (err.message === 'not_found') {
                  console.log(err.message, hashed);
                  return redis.addhash(hashed, jsonData).then(() => {
                    return push.addUpdate(destinationdb, item);
                  });
                }
                return Promise.reject(err);
              });

          }, {concurrency: 100})
            .then(() => resolve())
            .catch(err => {
              console.log(err)
            }
          );
        });
      }
    );
  }
}
;