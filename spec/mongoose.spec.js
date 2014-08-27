var orm = require('..');
var connections = require('../lib/connections');
var connectors = require(__dirname+'/app/config/connectors.js').default;

describe('mongoose', function() {
  describe('connection', function() {

    it('should recognise `origin`', function() {
      var conn = require('../lib/connections/mongoose')(connectors['mongo-db']);
      expect(connections.typeof(conn)).toBe('mongoose');
      conn.close();
    });

  });
  describe('model', function() {

    beforeEach(function(done) {
      orm.connect({
        connectorsPath: __dirname+'/app/config/connectors.js',
        modelsPath: __dirname+'/app/models'
      });
      orm.model('bird').remove({}, done);
    });

    afterEach(function() {
      orm.disconnect();
    });

    it('should handle `discriminators`', function(done) {
      orm.model('bird').create({ name: 'x' }, function(err, data) {
        expect(data.name).toBe('x');
        done();
      });
    });

    it('should handle `instance methods`', function(done) {
      orm.model('bird').create({ name: 'x' }, function(err, data) {
        expect(data.testMethod()).toBe('im');
        done();
      });
    });

    it('should handle `class methods`', function() {
      expect(orm.model('bird').testMethod()).toBe('cm');
    });

    it('should handle `plugins`', function(done) {
      orm.model('bird').create({ name: 'x' }, function(err, data) {
        expect(typeof data.createdAt).not.toBe('undefined');
        done();
      });
    });

    it('should handle `middlewares`', function(done) {
      orm.model('bird').create({ name: 'x' }, function(err, data) {
        expect(data.color).toBe('green');
        done();
      });
    });

  });
});
