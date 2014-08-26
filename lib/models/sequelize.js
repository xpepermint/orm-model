'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

/*
 * This module loads mongoose models. The model file should be structured as the
 * example bellow.
 *
 *    module.exports = {
 *      connector: 'mongo-db',
 *      extends: 'trigger',
 *      attributes: {
 *        name: 'string'
 *      },
 *      classMethods: {},
 *      instanceMethods: {}
 *    };
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
   * Loads model from a model conifg file.
   *
   * @param {string} fpath
   */

  var loadModel = function(name, data) {
    // extending data
    var odata = _.clone(data);
    if (data.extends) odata = _.merge(require(rootPath+'/'+data.extends), odata);
    // defining model
    var conn = connections.object(odata.connector);
    models[name] = conn.define(name, odata.attributes, odata.options);
  };

  /*
   * Loads models.
   */

  var loadModels = function() {
    fs.readdirSync(rootPath).forEach(function(fname) {
      var fpath = rootPath+"/"+fname;
      // ignoring directories
      if (fs.statSync(fpath).isFile()) {
        // loading model data
        var data = require(fpath);
        var name = path.basename(fpath, path.extname(fpath));
        // validating model type
        if (connections.object(data.connector).orm == 'sequelize') {
          // load model
          loadModel(name, data);
        }
      }
    });
  };

  // Loading models.
  loadModels();
  // Returnong a model.
  return models;
};
