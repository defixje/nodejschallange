const redis = require('redis');
const Promise = require('bluebird');
const client = redis.createClient();

module.exports = {
  addhash: function (key, document) {
    client.set(key, document);
    client.expire(key, 600);

    return Promise.resolve();
  },
  checkhash: function (hash) {

    return new Promise(function (resolve, reject) {

      client.exists(hash, function (err, reply){

        if (err !== null) {
          reject(err);
        }

        if (reply === 1) {
          client.expire(hash, 120);
          return resolve(true);
        }

        return reject(new Error('not_found'));
      });
    });
  }
};