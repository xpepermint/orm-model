module.exports = {

  default: {

    'mongo-db': {
      orm: 'mongoose',
      uris: 'mongodb://localhost/tagalitics',
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
