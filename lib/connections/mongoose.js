'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var mongoose = require('mongoose');

/**
 * Mongoose connection.
 *
 * @param {object} connector
 * @return {object}
 * @api private
 */

module.exports = function(connector, options) {
  mongoose.set('debug', options.logger || false);

  var conn = mongoose.createConnection(connector.uris, connector.options);
  conn.on("error", function(err) {
    console.log(err);
  });
  return conn;
};
