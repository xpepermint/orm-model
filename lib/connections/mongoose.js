'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

/**
 * Mongoose connection.
 *
 * @param {object} connector
 * @return {object}
 * @api private
 */

module.exports = function(connector) {
  var conn = mongoose.createConnection(connector.uris, connector.options);
  conn.on("error", function(err) {
    console.log(err);
  });
  return conn;
};
