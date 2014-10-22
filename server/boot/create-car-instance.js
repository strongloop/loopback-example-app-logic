module.exports = function(app, cb) {
  var Car = app.models.Car;
  Car.create({
    make: 'honda',
    model: 'civic'
  }, function(err, car) {
    if (err) {
      console.error(err);
      cb(err);
    } else {
      console.log('A car instance has been created from a boot script:', car);
      cb();
    }
  });
};
