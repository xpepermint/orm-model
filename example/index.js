var orm = require('..');
orm.connect();

// mongoose
// creating a record
orm.model('bird').create({ name: "Flappy" }, function(err, data) {
  console.log('Flappy bird created:', data);

  // list all birds
  orm.model('bird').find().exec(function(err, data) {
    console.log('All birds count:', data.length);
  });
});

// orm.model('emailer').find().exec(function(err, data) {
//   console.log('emailer', data.length);
// });
// orm.model('user').all().success(function(data) {
//   console.log('user', data.length);
// });
