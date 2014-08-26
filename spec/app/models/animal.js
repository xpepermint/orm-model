module.exports = {
  connector: 'mongo-db',
  attributes: {
    name: 'string',
    color: 'string'
  },
  classMethods: {
    testMethod: function() { return 'cm' }
  },
  instanceMethods: {
    testMethod: function() { return 'im' }
  },
  plugins: [
    { fn: require('mongoose-timestamp'), options: { index:true } }
  ],
  middleware: {
    pre: [
      { event: 'save', fn: function(next) { this.color = 'green'; next() }}
    ]
  },
  options: {}
};
