module.exports = function(app, cb) {
  app.models.Car.create({
    make: 'honda',
    model: 'civic'
  }, function(err, car) {
    if (err)
      return cb(err);

    console.log('A `car` instance has been created from a boot script:', car);

    cb();
  });
};
