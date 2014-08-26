module.exports = {

  default: {

    'mongo-db': {
      orm: 'mongoose',
      uris: 'mongodb://127.0.0.1/mongo_test',
      options: {}
    },

    'seq-db': {
      orm: 'sequelize',
      database: 'sequelize_test1',
      username: 'root',
      password: '',
      options: { dialect: 'mysql' }
    }
  },

  production: {

  }

};
