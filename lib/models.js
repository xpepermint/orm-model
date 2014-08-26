'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var fs = require('fs');

/*
 *
 * @api public
 */

module.exports = {

  /**
   * List of defined models.
   */

  _models: {},

  /**
   * Returns a model object.
   *
   * @param {string} name
   * @return {Object}
   */

  object: function(name) {
    return this._models[name] || null;
  },

  /**
   * Loads models.
   *
   * @param {object} connectors
   * @param {path} connectors
   */

  load: function(connections, path) {
    fs.readdirSync(__dirname+'/models').forEach(function(fname) {
      _.merge(this._models, require(__dirname+'/models/'+fname)(connections, path));
    }.bind(this));
  },

  /**
   * Unloads models.
   */

  unload: function() {
    Object.keys(this._models).forEach(function(name) {
      delete this._models[name];
    }.bind(this));
  }

};
