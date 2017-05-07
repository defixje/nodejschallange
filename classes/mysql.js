const mysql = require("mysql");

module.exports = {
  sourcedb: function () {
    const conn = mysql.createConnection(
      {
        host: "172.17.0.1",
        user: "root",
        password: "root",
        database: "nodejschallange"
      }
    );

    conn.connect(function (err) {
      if (err) {
        console.log('Error connecting to source DB:\n' + err.message);
        return;
      }
      console.log('Connection established to source DB')
    });

    return conn;
  },
  destinationdb: function () {
    const conn = mysql.createConnection(
      {
        host: "172.17.0.1",
        user: "root",
        password: "root",
        database: "nodejschallangeshadow"
      }
    );

    conn.connect(function (err) {
      if (err) {
        console.log('Error connecting to destination DB:\n' + err.message);
        return;
      }
      console.log('Connection established to destination DB')
    });

    return conn;
  },
  getRowsFromSource: function (rows, callback) {

    if (typeof rows === 'undefined') rows = 1;

    return this.sourcedb().query('SELECT * FROM dummy LIMIT ?', rows, function (err, rows) {
      if (err) {
        callback(err, null)
      }
      callback(null, rows)
    });
  },
  rowcountsource: function (callback) {
    return this.sourcedb().query('SELECT COUNT(*) as rows FROM dummy', function (err, data) {
      if (err) {
        callback(err, null)
      }
      callback(null, JSON.stringify(data))
    });
  }
};