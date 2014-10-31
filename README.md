#Overview
In any real world application, you will need to define your own custom
application logic. This tutorial will show you how to use remote methods,
remote hooks, model hooks, boot scripts, pre-processing middleware, and
post-processing middleware to integrate your ideas into a LoopBack application.

---

#Prerequisites
Ensure you meet the requirements of the following lists before diving into the
tutorial.

###Dependencies
* Node `node -v #v0.10.31`
* NPM `npm -v #1.4.23`
* StrongLoop Controller `slc -v #v2.9.2`

###Knowledge
* [LoopBack](http://docs.strongloop.com/display/LB/LoopBack+2.0)
* [Creating data sources](http://docs.strongloop.com/display/LB/Data+sources+and+connectors)
* [Creating models](http://docs.strongloop.com/display/LB/Creating+models)

---

#Run the app
To see the example in action, run:

```
git clone git@github.com:strongloop:loopback-example-app-logic
cd loopback-example-app-logic
npm install
slc run
```

>This example requires you make `curl` requests to see certain output. The two
requests you will make are `curl -XPOST localhost:3000/api/cars/rev-engine -H
'content-type:application/json' -d '{"sound":"vroom"}'` and `curl
localhost:3000/datetime`. See [step 2](#2-define-a-remote-method) and [step
8](#8-define-post-processing-middleware) for more details.

---

#Procedure
In this example, we build an application that consists of one model named `car`.
We will be adding remote methods, remote hooks, and models hooks to this model.
In addition, we will also create a `car` model instance in a boot script.
Finally, we end with adding pre-processing middleware that displays and
post-processing middleware that simply reports the current date and time.

###1. Bootstrap the app
Set up the basic infrastructure for the app. Do the following:

1. Scaffold the app
  - Name your application `loopback-example-app-logic`
2. Create the car model
  - slc loopback:model
    - Model name: car
    - Data source: db (memory)
    - Expose via REST: yes
    - Custom plural form: default (blank)
    - Properties
      - make | String | not required
      - model | String | not required

>We will use the default (in-memory) data source, meaning you do not need to
configure one unlike a real app where you would normaly do this as part of the
bootstrapping process.

###2. Define a remote method
In `common/models/car.js`, define a remote method accessible at `POST
/rev-engine` that is mapped to static function named `revEngine`:

```
...
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
...
```

This remote method simply takes a sound and repeats it three times. Test it by
starting the server with `slc run` and make a HTTP request with ` curl -XPOST
localhost:3000/api/cars/rev-engine -H 'content-type:application/json' -d
'{"sound":"vroom"}'`. In the response, you should see:

```
...
{"engineSound":"vroom vroom vroom"}
```

###3. Define a remote method before hook
In `common/models/car.js`, add:

```
...
//remote method before hook
Car.beforeRemote('revEngine', function(context, unused, next) {
  console.log('Putting in the car key, starting the engine.');
  next();
});
...
```

This method is triggered right before `revEngine` is called and simply prints a
message to the console. Test it by restarting the server and performing the same
HTTP request from [step 2](#2-define-a-remote-method). In the server
output, you should see:

```
...
Putting in the car key, starting the engine.
```

>The second parameter `unused` must be provided for legacy reasons. You can
simply ignore it as long as you declare it to make sure `next` is the third
parameter. This is a side effect of inheriting from the
[`jugglingdb`](https://github.com/1602/jugglingdb) library.

>`context` contains the [Express](http://expressjs.com/) request and response
objects. This means you have access to context specific information if
necessary.

###4. Define a remote method after hook
In `common/models/car.js`, add:

```
...
//remote method after hook
Car.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
  console.log('Turning off the engine, removing the key.');
  next();
});
...
```

>The second argument `remoteMethodOutput` contains the value from the callback
in the remote method `revEngine`. This allows you manipulate the resulting
value before sending it to its final destination.

This method triggers after `revEngine` finishes execution and prints a simple
message. Test it by restarting the server and  performing the same HTTP request
in [step 2](#2-define-a-remote-method). In the server output, you should see:

```
...
Turning off the engine, removing the key.
```

###5. Create a boot script
Let's make an instance of a `Car`. Create a boot script named
`create-car-instance.js` in `server/boot` with the following contents:

```
module.exports = function(app) {
  var Car = app.models.Car;
  Car.create({
    make: 'honda',
    model: 'civic'
  }, function(err, car) {
    if (err) {
      console.error(err);
    } else {
      console.log('A car instance has been created from a boot script:', car);
    }
  });
};
```

>The `app` argument is provided by LoopBack. You can use it to access the
application context to retrieve models, configs, etc.

Boot scripts are executed on application startup. Test this script by restarting
the server and you should see the following server output:

```
A car instance has been created from a boot script: { make: 'honda',
  model: 'civic',
  id: 1 }
```

>LoopBack supports both synchronous and asynchronous boot scripts.  For a
synchronous boot script, you should use `module.exports = function(app)...` vs
asynchronous boot scripts which look like `module.exports = function(app,
callback)...`. The main difference is you may provide a callback depending if
necessary depending on your use case.

###6. Create a synchronous boot script
Create a second boot script named `print-models.js` in `server/boot` with the
following contents:

```
module.exports = function(app) {
  var modelNames = Object.keys(app.models);
  var models = [];
  modelNames.forEach(function(m) {
    var modelName = app.models[m].modelName;
    if (models.indexOf(modelName) === -1) {
      models.push(modelName);
    }
  });
  console.log('Models: ', models);
};
```

This script simply prints the models names thats are currently registered in the
LoopBack application. Test it by restarting the server and you should see:

```
...
Models:  [ 'User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'car' ]
...
```

###6. Create an asynchronous boot script
Coming soon. Similar to a synchronous boot script, but just provide the
`callback` argument in the function signature.

```
module.exports = function(app, cb) {
  ...
};
```

###7. Define a model hook
In `common/models/car.js`, add:

```
...
//model hook
Car.beforeSave = function(next, model) {
  console.log('About to save a car instance:', model);
  next();
};
...
```

>Note `next` is the first argument, which is unusual when compared to
conventional javascript contexts as the convention is to list `next` as the
last argument. This is a side effect of inheriting from the
[`jugglingdb`](https://github.com/1602/jugglingdb) library.

This hook runs whenever a `Car` model instance is about to be saved. In our
case, we create an instance in the boot script from [step
5](#5-create-a-boot-script). Test it
by restarting the server and it should output:

```shell
...
About to save a car instance: { make: 'honda', model: 'civic' }
A car instance has been created from a boot script: { make: 'honda',
  model: 'civic',
  id: 1 }
...
```

As you can see, the model hook is triggered **before** saving a `Car` model
instance.

>There are many other model, such as `afterInitialize`, `beforeValidate`,
`beforeDestroy`, etc. See the [model hooks
documentation](http://docs.strongloop.com/display/LB/Model+hooks) for more
information.

###8. Define pre-processing middleware
In `server`, create a directory named `middleware`. Next, create a middleware
script named `tracker.js` in `server/middleware` with the following contents:

```
module.exports = function(req, res, next) {
  console.log('Request tracking middleware triggered on %s.', req.url);
  var start = process.hrtime();
  res.once('finish', function() {
    var diff = process.hrtime(start);
    var ms = diff[0] * 1e3 + diff[1] * 1e-6;
    console.log('The request processing time is %d ms.', ms);
  });
  next();
};
```

Then modify `server/server.js` to look like:

```
...
// -- Add your pre-processing middleware here --
var reqTracker = require('./middleware/tracker');
app.use(reqTracker);
...
```

This middleware simply prints the request processing time and is triggered on
all routes for any type of request. Test this by performing the same HTTP
request from [step 2](#2-define-a-remote-method) and you should see:

```
...
The request processing time is 19.147569999999998 ms.
```

>19.147569999999998 will be different depending on how long it takes to process
the request on your machine.

>For more information on middleware, see the [Express middleware
documentation](http://expressjs.com/api.html#middleware.api).

###9. Define post-processing middleware
Modify `server/server.js` to look like:

```
...
// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
//   var path = require('path');
//   app.use(loopback.static(path.resolve(__dirname, '../client')));
app.use('/datetime', function(req, res, next) {
  console.log('Date time middleware triggered.');
  res.json({datetime: new Date()});
});
...
```

This middleware is triggered when any request type is sent to the  `/datetime`
route. Test this by restarting the server and running `curl
localhost:3000/datetime`. In the server output, you should see:

```
...
Date time middleware triggered.
...
```

In the curl response, you should see `{"datetime":"2014-10-21T08:13:51.289Z"}`.

#Conclusion
That's it! You've now tried a variety of ways and places to implement your own
custom application logic. For more information, see the [LoopBack application
logic documentation](http://docs.strongloop.com/display/LB/Extending+a+LoopBack+application).
