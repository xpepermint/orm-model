var orm = require('..');
var connections = require('../lib/connections');
var connectors = require(__dirname+'/app/config/connectors.js').default;

describe('mongoose', function() {
  describe('connection', function() {

    it('should recognise `origin`', function() {
      var conn = require('../lib/connections/sequelize')(connectors['seq-db']);
      expect(connections.typeof(conn)).toBe('sequelize');
    });

  });
});
