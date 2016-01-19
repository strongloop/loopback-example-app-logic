module.exports = function(Car) {
  // remote method
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

  // remote method before hooks
  Car.beforeRemote('revEngine', function(context, unused, next) {
    console.log('Putting in the car key, starting the engine.');
    next();
  });

  // afterInitialize is a model hook which is still used in loopback
  Car.afterInitialize = function() {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Car.observe('before save', function(ctx, next) {
    console.log('> before save triggered:', ctx.Model.modelName, ctx.instance ||
      ctx.data);
    next();
  });
  Car.observe('after save', function(ctx, next) {
    console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Car.observe('before delete', function(ctx, next) {
    console.log('> before delete triggered:',
      ctx.Model.modelName, ctx.instance);
    next();
  });
  Car.observe('after delete', function(ctx, next) {
    console.log('> after delete triggered:',
      ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Car.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
    console.log('Turning off the engine, removing the key.');
    next();
  });

  // model operation hook
  Car.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      console.log('About to save a car instance:', ctx.instance);
    } else {
      console.log('About to update cars that match the query %j:', ctx.where);
    }
    next();
  });
};
