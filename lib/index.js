'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var connections = require('./connections');
var models = require('./models');

/**
 * Main class.
 *
 * @api public
 */

module.exports = {

  /*
   * Loads connectors, creates connections from them and loads models.
   *
   * @param {object} opts
   * @api public
   */

  connect: function(opts) {

    var options = _.merge({
      connectorsPath: process.cwd()+'/config/connectors.js',
      modelsPath: process.cwd()+'/app/models'
    }, opts);

    // TODO
    var connectors = require(options.connectorsPath);
    connectors = _.merge({}, connectors.default, connectors[process.env.NODE_ENV]);

    connections.connect(connectors);
    models.load(connections, options.modelsPath);
  },

  /*
   * Disconnects open connections and unload models.
   *
   * @return {generator}
   * @api public
   */

  disconnect: function() {
    models.unload(options.modelsPath);
    connections.disconnect();
  },


  /*
   * Returns ORM module.
   *
   * @param {string} name
   * @return {object}
   * @api public
   */

  orm: function(name) {
    return require(name);
  },

  /*
   * Returns ORM database connection.
   *
   * @param {string} name
   * @return {object}
   * @api public
   */

  connection: function(name) {
    return connections.object(name);
  },

  /*
   * Returns ORM model.
   *
   * @param {string} name
   * @return {object}
   * @api public
   */

  model: function(name) {
    return models.object(name);
  }

};
