'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var util = require('util');
var utils = require('mongoose/lib/utils');

/*
 * Helper for `buildLogger`.
 * (copy & paste from mongoose module)
 */

function print (arg) {
  var type = typeof arg;
  if ('function' === type || 'undefined' === type) return '';
  var data = format(arg);
  return typeof data == 'object' ? JSON.stringify(data) : data;
}

/*
 * Helper for `buildLogger`.
 * (copy & paste from mongoose module + removing return statement)
 */

function format (obj, sub) {
  var x = utils.clone(obj);
  if (x) {
    if ('Binary' === x.constructor.name) {
      x = '[object Buffer]';
    } else if ('ObjectID' === x.constructor.name) {
      var representation = 'ObjectId("' + x.toHexString() + '")';
      x = { inspect: function() { return representation; } };
    } else if ('Date' === x.constructor.name) {
      var representation = 'new Date("' + x.toUTCString() + '")';
      x = { inspect: function() { return representation; } };
    } else if ('Object' === x.constructor.name) {
      var keys = Object.keys(x)
        , i = keys.length
        , key
      while (i--) {
        key = keys[i];
        if (x[key]) {
          if ('Binary' === x[key].constructor.name) {
            x[key] = '[object Buffer]';
          } else if ('Object' === x[key].constructor.name) {
            x[key] = format(x[key], true);
          } else if ('ObjectID' === x[key].constructor.name) {
            ;(function(x){
              var representation = 'ObjectId("' + x[key].toHexString() + '")';
              x[key] = { inspect: function() { return representation; } };
            })(x)
          } else if ('Date' === x[key].constructor.name) {
            ;(function(x){
              var representation = 'new Date("' + x[key].toUTCString() + '")';
              x[key] = { inspect: function() { return representation; } };
            })(x)
          } else if (Array.isArray(x[key])) {
            x[key] = x[key].map(function (o) {
              return format(o, true)
            });
          }
        }
      }
    }
    if (sub) return x;
  }
  return x; // modified
}

/**
 * Returns logger.
 *
 * @param {boolean|function}
 * @return {boolean|function}
 */

function buildLogger(logger) {
  return typeof logger != 'function' ? logger : function() {
    logger(util.format(
      '%s.%s(%s) %s %s %s',
      print(arguments[0]),
      print(arguments[1]),
      print(arguments[2]),
      print(arguments[3]),
      print(arguments[4]),
      print(arguments[5])
    ));
  };
}

/**
 * Mongoose connection.
 *
 * @param {object} connector
 * @return {object}
 * @api private
 */

module.exports = function(connector, options) {
  mongoose.set('debug', buildLogger(options.logger));

  var conn = mongoose.createConnection(connector.uris, connector.options);
  conn.on("error", function(err) {
    console.log(err);
  });
  return conn;
};
