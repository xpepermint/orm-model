'use strict';

/**
 * Module dependencies.
 */

var Sequelize = require('sequelize');
var mongoose = require('mongoose');

/**
 * Returns logger.
 *
 * @param {boolean|function}
 * @return {boolean|function}
 */

function buildLogger(logger, orm, connector) {
  switch(typeof logger) {
    case 'function':
      return logger;
    case 'object':
      return !logger[orm] ? false : function() {
        logger[orm].apply(null, [orm, connector].concat(Array.prototype.slice.call(arguments)));
      };
  }
  return logger || false;
}

/**
 * This module defines `mongoose` and `sequelize` database connections.
 *
 * @api private
 */

module.exports = {

  /**
   * List of opened connections.
   */

  _connections: {},

  /**
   * Returns a database connection.
   *
   * @param {string} name
   * @return {Object}
   */

  object: function(name) {
    return this._connections[name] || null;
  },

  /**
   * Connects to databases. See the expected attribute structure bellow.
   *
   *   {  default: {
   *        'mongo-db1': {
   *          orm: 'mongoose',
   *          uris: ['mongodb://user:pass@host:port/database'],
   *          options: {}
   *        },
   *        'mysql-db2': {
   *          orm: 'sequelize',
   *          database: 'database',
   *          username: 'username',
   *          password: 'password',
   *          options: {}
   *        }
   *      },
   *      production: {}
   *   }
   *
   * @param {object} options
   * @param {object} connectors
   */

  connect: function(connectors, options) {
    Object.keys(connectors).forEach(function(name) {
      var connector = connectors[name];
      var config = { logger: buildLogger(options.logger, connector.orm, name) };
      this._connections[name] = require('./connections/'+connector.orm)(connector, config);
    }.bind(this));
  },

  /**
   * Disconnects from databases.
   */

  disconnect: function() {
    Object.keys(this._connections).forEach(function(name) {
      var connection = this._connections[name];
      connection.close();
      delete this._connections[name];
    }.bind(this));
  },

  /**
   * Returns the name of connection's ORM.
   *
   * @param {object} conn
   * @return {string}
   */

  typeof: function(conn) {
    return typeof conn.dialect != 'undefined' ? 'sequelize' : 'mongoose';
  }

};
