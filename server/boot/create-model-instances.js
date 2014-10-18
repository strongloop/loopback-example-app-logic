var debug = require('debug')('boot');

module.exports = function(app) {
  var Car = app.models.Car;
  Car.create({
    make: 'honda',
    model: 'civic'
  }, function(err, car) {
    if (err) return console.log(err);
    console.log('Saving a car instance from a boot script', car);
  });
};
