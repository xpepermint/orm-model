'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var Sequelize = require('sequelize');

/**
 * Sequelize connection.
 *
 * @param {object} options
 * @param {object} connector
 * @return {object}
 * @api private
 */

module.exports = function(connector, options) {
  options.logging = options.logger==true ? console.log : options.logger;

  var conn = new Sequelize(connector.database, connector.username, connector.password, options);
  conn.close = conn.close || function() {}; // parent module expects close() method that closes the connection
  return conn;
};
