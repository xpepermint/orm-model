'use strict';

/**
 * Module dependencies.
 */

var Sequelize = require('sequelize');
var mongoose = require('mongoose');

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
   * @param {object} connectors
   */

  connect: function(connectors) {
    Object.keys(connectors).forEach(function(name) {
      var connector = connectors[name];
      this._connections[name] = require('./connections/'+connector.orm)(connector);
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
