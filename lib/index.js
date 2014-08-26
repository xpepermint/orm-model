'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var connections = require('./connections');
var models = require('./models');

/**
 *
 *
 * @param {object} opts
 * @return {generator}
 * @api public
 */

module.exports = {

  /*
   * XX
   *
   * @param {object} opts
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
   * XX
   *
   * @return {generator}
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
   */

  orm: function(name) {
    return require(name);
  },

  /*
   * Returns ORM database connection.
   *
   * @param {string} name
   * @return {object}
   */

  connection: function(name) {
    return connections.object(name);
  },

  /*
   * Returns ORM model.
   *
   * @param {string} name
   * @return {object}
   */

  model: function(name) {
    return models.object(name);
  }

};
