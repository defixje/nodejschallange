const redis = require('redis');
const Promise = require('bluebird');
const client = redis.createClient();

module.exports = {
  addhash: function (key, document) {
    client.set(key, document);
    client.expire(key, 180);
  },
  checkhash: function (hash) {

    return new Promise(function (resolve, reject) {

      client.exists(hash, function (err, reply){

        if (err !== null) {
          reject(err);
        }

        if (reply === 1) {
          resolve(true);
          client.expire(hash, 180);
        } else {
          resolve(false);
        }
      });


    });
  }
};