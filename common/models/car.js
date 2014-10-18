var debug = require('debug')('remote-method');

module.exports = function(Car) {
  //remote method
  Car.revEngine = function(sound, cb) {
    cb(null, sound + ' ' + sound + ' ' + sound);
  };
  Car.remoteMethod(
    'revEngine',
    {
      accepts: [{arg: 'sound', type: 'string'}],
      returns: {arg: 'revEngine', type: 'string'},
      http: {path:'/rev-engine', verb: 'post'}
    }
  );

  //remote method before hook
  Car.beforeRemote('revEngine', function(context, unused, next) {
    //@ritch @bajtos - why do  we have "unused" as the second param, seems hacky
    debug('beforeRemote', arguments);
    debug(unused);
    console.log('Putting in the car key, starting the engine...');
    next();
  });

  //remote method after hook
  Car.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
    debug('afterRemote', arguments);
   debug(remoteMethodOutput);
   console.log('Turning off the engine, removing the key');
   next();
  });

  //model hook - @ritch why is next first param, convention is "next" is last
  Car.beforeSave = function(next, model) {
    debug('beforeSaveHook', arguments);
    console.log('About to save a car instance...');
    next();
  };
};

