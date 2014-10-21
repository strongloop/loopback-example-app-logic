module.exports = function(app, cb) {
  var Car = app.models.Car;
  Car.create({
    make: 'honda',
    model: 'civic'
  }, function(err, car) {
    if (err) return console.log(err);
    console.log('Saving a car instance from a boot script', car);
    cb();
  });
};
