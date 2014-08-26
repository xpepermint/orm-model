'use strict';

/**
 * Module dependencies.
 */

let Sequelize = require('sequelize');

/**
 * Sequelize connection.
 *
 * @param {object} connector
 * @return {object}
 * @api private
 */

module.exports = function(connector) {
  var conn = new Sequelize(connector.database, connector.username, connector.password, connector.options);
  conn.close = conn.close || function() {}; // parent module expects close() method that closes the connection
  return conn;
};
