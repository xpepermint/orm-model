'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

/*
 * This module loads mongoose models.
 *
 * @param {object} connectors
 * @param {string} rootPath
 * @return {object}
 * @api private
 */

module.exports = function(connections, rootPath) {

  // All registered models.
  var models = {};

  /*
   * Loads a model.
   *
   * @param {string} fpath
   */

  var loadModel = function(name, data) {
    var schema = createModelSchema(data);
    var conn = connections.object(data.connector);
    models[name] = conn.model(name, schema);
  };

  /*
   * Loads a discriminator model.
   *
   * @param {string} fpath
   * @see http://mongoosejs.com/docs/api.html#model_Model-discriminators
   */

  var loadDiscriminator = function(name, data) {
    var mdata = require(rootPath+"/"+data.extends);
    var schema = createModelSchema(_.merge(_.clone(mdata), data));
    var conn = connections.object(mdata.connector);
    models[name] = conn.model(data.extends).discriminator(name, schema);
  };

  /*
   * Creates model schema instance based on model data. Here we implement model
   * behaviour (e.g. timestamp attributes, callbacks).
   *
   * @returns {object}
   * @see http://mongoosejs.com/docs/guide.html
   */

  var createModelSchema = function(data) {
    // new mongoose schema instance
    var instance = new mongoose.Schema(data.attributes, data.options);
    // instance methods
    if (data.instanceMethods) {
      Object.keys(data.instanceMethods).forEach(function(name) {
        instance.method(name, data.instanceMethods[name]);
      });
    }
    // class methods
    if (data.classMethods) {
      Object.keys(data.classMethods).forEach(function(name) {
        instance.static(name, data.classMethods[name]);
      });
    }
    // plugins
    if (data.plugins) {
      data.plugins.forEach(function(plugin) {
        instance.plugin(plugin.fn, plugin.options);
      });
    }
    // middleware
    if (data.middleware) {
      Object.keys(data.middleware).forEach(function(when) {
        data.middleware[when].forEach(function(middleware) {
          instance[when](middleware.event, middleware.fn);
        });
      });
    }
    // returning model schema instance
    return instance;
  };

  /*
   * Loads models/discriminators.
   *
   * @param {boolean} discriminator
   */

  var loadModels = function(discriminator) {
    fs.readdirSync(rootPath).forEach(function(fname) {
      var fpath = rootPath+"/"+fname;
      // ignoring directories
      if (fs.statSync(fpath).isFile()) {
        // loading model data
        var data = require(fpath);
        var name = path.basename(fpath, path.extname(fpath));
        // validating model type
        if (connections.typeof(connections.object(data.connector)) == 'mongoose') {
          // load discriminator
          if (discriminator && data.extends) {
            loadDiscriminator(name, data);
          }
          // load model
          else if (!discriminator && !data.extends) {
            loadModel(name, data);
          }
        }
      }
    });
  };

  // Loading models.
  loadModels(false);
  // Loading discriminators.
  loadModels(true);
  // Returnong a model.
  return models;
};
