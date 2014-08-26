'use strict';

/**
 * Module dependencies.
 */

let Sequelize = require('sequelize');
let mongoose = require('mongoose');

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
    // loading each connector
    Object.keys(connectors).forEach(function(name) {
      // connector data
      var connector = connectors[name];
      // connecting to database
      this._connections[name] = require('./connections/'+connector.orm)(connector);
      // adding connector data
      this._connections[name].orm = connector.orm
    }.bind(this));
  },

  /**
   * Disconnects from databases.
   */

  disconnect: function() {
    // looping through connections
    Object.keys(this._connections).forEach(function(name) {
      // connection instance
      var connection = this._connections[name];
      // closing connection
      connection.close();
      // unloading
      delete this._connections[name];
    }.bind(this));
  }

};
