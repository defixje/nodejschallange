const redis = require('redis');
const client = redis.createClient();

module.exports = {
  addhash: function (key, document) {
    client.set(key, document);
    client.expire(key, 180);
  },
  checkhash: function (hash, json, callback) {
    client.get(hash, function(err, reply) {
      callback(null, reply);
    });

    client.expire(hash, 180);
  }
};