const mysql = require('../classes/mysql');

module.exports = {
  addUpdate: function (connection, document) {
      return mysql.addUpadteRow(connection, document);
  }
};