# orm-model

![Build Status](https://travis-ci.org/xpepermint/orm-model.svg?branch=master)&nbsp;[![NPM version](https://badge.fury.io/js/orm-model.svg)](http://badge.fury.io/js/orm-model)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/orm-model.svg)](https://gemnasium.com/xpepermint/orm-model)

ORM libraries are great but they usually left you with a gigantic and unstructured block of code. You have to manually figure the right way on how to split the code into multiple files and it gets event worse when you have multiple databases or even multiple ORMs.

This module brings unified MVC-style structure for models into your NodeJS project. Currently the [mongoose](http://mongoosejs.com/) and [sequelize](http://sequelizejs.com) ORMs are supported.

## Installation

Install the [npm](https://www.npmjs.org/package/orm-model) package.

```
npm install orm-model --save
```

## Setup

Let's first configure project's **database connectors** (connections). By default the module will try to read the `config/connectors.js` configuration file so let's create it. The file content should look like the example bellow.

```js
// config/connectors.js
module.exports = {

  default: {

    // mongoose database connector
    'mongo-db': {
      orm: 'mongoose',
      uris: 'mongodb://user:secret@hostname:port/database',
      options: {}
    },

    // sequelize database connector
    'seq-db': {
      orm: 'sequelize',
      database: 'database',
      username: 'root',
      password: 'secret',
      options: {}
    }
  },

  production: {}
};
```

The next step is to **define models**. The module will load files found at `app/models`. Let's create two models for `mongo-db` connector and two models for `seq-db` connector (defined earlier).

```js
// app/models/animal.js (mongoose model)
module.exports = {
  connector: 'mongo-db',
  attributes: {
    name: 'string'
  },
  classMethods: {},
  instanceMethods: {},
  plugins: [],
  middleware: {},
  options: {}
};
```
```js
// app/models/bird.js (mongoose discriminator of animal)
module.exports = {
  connector: 'mongo-db',
  extends: 'animal'
};
```
```js
// app/models/user.js (sequelize model)
module.exports = {
  connector: 'seq-db',
  attributes: {
    name: 'STRING'
  },
  options: {
    classMethods: {},
    instanceMethods: {}
  }
};
```
```js
// app/models/friend.js (sequelize model extends from user)
module.exports = {
  connector: 'seq-db',
  extends: 'user'
};
```

Now we only have to **load and connect** connectors and models together to make it work. We do this inside project's main file (e.g. `index.js`).

```js
var orm = require('../orm-model');
orm.connect({
  connectorsPath: 'new/file/path.js', // optional
  modelsPath: 'new/directory/path' // optional
});
```

## API

After the project has been setup we can access any model like this:

```js
var orm = require('orm-model');
var Bird = orm.model('bird');

Bird.create({ name: "Fluppy" }, function(err, data) {
  console.log('Mongoose Fluppy bird created.');
});
```

You can also access an instance of a connector (database connection).

```js
var orm = require('orm-model');
var sequelize = orm.connection('seq-db');

sequelize.query("SELECT * FROM users").success(function(data) {
  console.log('Sequelize results:', data);
});
```
