// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-app-logic
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

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
