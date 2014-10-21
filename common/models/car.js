module.exports = function(Car) {
  //remote method
  Car.revEngine = function(sound, cb) {
    cb(null, sound + ' ' + sound + ' ' + sound);
  };
  Car.remoteMethod(
    'revEngine',
    {
      accepts: [{arg: 'sound', type: 'string'}],
      returns: {arg: 'engineSound', type: 'string'},
      http: {path:'/rev-engine', verb: 'post'}
    }
  );

  //remote method - before hook
  Car.beforeRemote('revEngine', function(context, unused, next) {
    console.log('Putting in the car key, starting the engine...');
    next();
  });

  //remote method - after hook
  Car.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
    console.log('Turning off the engine, removing the key');
    next();
  });

  //model hook - before save
  Car.beforeSave = function(next, model) {
    console.log('About to save a car instance: ', model);
    next();
  };
};

