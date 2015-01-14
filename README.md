#loopback-example-app-logic

```
git clone https://github.com/strongloop/loopback-example-app-logic.git
cd loopback-example-app-logic
npm install
slc run
# then in a different tab, run ./bin/remote-method-request or ./bin/datetime-request
```

In this example, we demonstrate remote methods, remote hooks, model hooks, boot scripts, and middleware as solutions for integrating user-defined logic into a LoopBack application.

- [Prerequisites](#prerequisites)
- [Procedure](#procedure)
  - [1. Create the application](#1-create-the-application)
  - [2. Add a model](#2-add-a-model)
  - [3. Define a remote method](#3-define-a-remote-method)
  - [4. Define a remote method before hook](#4-define-a-remote-method-before-hook)
  - [5. Define a remote method after hook](#5-define-a-remote-method-after-hook)
  - [6. Create a boot script](#6-create-a-boot-script)
  - [7. Define a model hook](#7-define-a-model-hook)
  - [8. Add pre-processing middleware](#8-add-pre-processing-middleware)
  - [9. Add post-processing middleware](#9-add-post-processing-middleware)
  - [10. Conclusion](#10-conclusion)

##Prerequisites

###Tutorials

- [Getting started with LoopBack](http://docs.strongloop.com/display/LB/Getting+started+with+LoopBack)
- [Tutorial series - step 1](https://github.com/strongloop/loopback-example#step-one---the-basics)
- [Tutorial series - step 2](https://github.com/strongloop/loopback-example#step-two---relations-and-filter)

###Knowledge

- [LoopBack models](http://docs.strongloop.com/display/LB/Defining+models)
- [LoopBack adding application logic](http://docs.strongloop.com/display/LB/Adding+application+logic)

##Procedure

###1. Create the application

####Application information

- Name: `loopback-example-app-logic`
- Directory to contain the project: `loopback-example-app-logic`

```
slc loopback loopback-example-app-logic
... # follow the prompts
cd loopback-example-app-logic
```

###2. Add a model

####Model information
- Name: `car`
  - Datasource: `db (memory)`
  - Base class: `PersistedModel`
  - Expose via REST: `Yes`
  - Custom plural form: *Leave blank*
  - Properties
    - `make`
      - String
      - Not required
    - `model`
      - String
      - Not required

```
slc loopback:model car
... # follow the prompts
```

###3. Define a remote method

Define a [remote method in `car.js`](/common/models/car.js#L2-L13).

> The remote method takes a "sound" and repeats it 3 times.

Create a [`bin` directory](/bin) to store scripts.

```
mkdir bin
```

In this directory, create an **executable** [shell script named `remote-method-request`](/bin/remote-method-request).

> Remember to set execute permissions on the script to run it (ie. `chmod a+x ./bin/remote-method-request`

Start the server (`slc run`).

```
./bin/remote-method-request
```

You should see:

```
...
{"engineSound":"vroom vroom vroom"}
```

###4. Define a remote method before hook

Define a [remote method before hook in `car.js`](/common/models/car.js#L15-L19).

> The second parameter `unused` must be provided for legacy reasons. You may simply ignore it, but you must declare it to ensure `next` is the third parameter. This is a side effect of inheriting from the [`jugglingdb`](https://github.com/1602/jugglingdb) library.

> `context` contains the [Express](http://expressjs.com/) request and response objects (ie. `context.req` and `context.res`).

This method is triggered right before `revEngine` is called and prints a message to the console.

Restart the server.

```
./bin/remote-method-request
```

You should see:

```
...
Putting in the car key, starting the engine.
```

###5. Define a remote method after hook

Define a [remote method after hook in `car.js`](/common/models/car.js#L21-L25).

This method is triggered after `revEngine` finishes execution and prints a message to the console.

Restart the server.

```
./bin/remote-method-request
```

You should see:

```
...
Turning off the engine, removing the key.
```

###6. Create a boot script

Create [`print-models.js`](/server/boot/print-models.js) in the [`boot` directory](/server/boot).

> The [`app` argument](/server/boot/print-models.js#L1) is provided by LoopBack. You can use it to access the application context, which is required when you want to retrieve models, configs, etc.

> ####Asynchronous boot scripts
> To use asynchronous boot scripts, you have to modify [`boot`](/examples/async-boot-scripts/server.js#L1) to take  callback. You will also need to provide an additional [`callback` argument](/examples/async-boot-script/create-car.js#L1) in your boot scripts.

Restart the server.

In the server output, you should see:

```
...
Models:  [ 'User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'car' ]
...
```

###7. Define a model hook

Define [a model hook in `car.js`](/common/models/car.js#L27-L31).

Restart the server.

```
./bin/remote-method-request
```

You should see:

```
...
About to save a car instance: { make: 'honda', model: 'civic' }
...
```

This model hook is triggered **before** saving any `car` model instance.

> Many other hooks are available, such as `afterInitialize`, `beforeValidate`, `beforeDestroy`, etc. See the [model hooks documentation](http://docs.strongloop.com/display/LB/Model+hooks) and [`loopback-faq-model-hooks`](https://github.com/strongloop/loopback-faq-model-hooks) for more information.

###8. Add pre-processing middleware

Create the [`middleware` directory](/server/middleware) to store middleware
files.

```
mkdir server/middleware
```

Create the [`tracker` middleware](/server/middleware/tracker.js) to respond with
the request processing time.

Register the `tracker` middleware in [`middleware.json`](https://github.com/strongloop/loopback-example-app-logic/blob/master/server/middleware.json#L7).

> We register `tracker` in the `initial` phase because we want it configured before other middleware. See the [official middleware phases documentation](http://docs.strongloop.com/display/LB/Defining+middleware#Definingmiddleware-Middlewarephases).

Restart the server.

```
./bin/remote-method-request
```

You should see:

```
...
The request processing time is 28.472051 ms.
```

> Your time will be different.

###9. Add post-processing middleware

Create the [`datetime` middleware](/server/middleware/datetime.js) which responds with the current date and time when a request is made to [`localhost:3000/datetime`](http://localhost:3000/datetime).

Register the `tracker` middleware in [`middleware.json`](https://github.com/strongloop/loopback-example-app-logic/blob/master/server/middleware.json#L19-L21).

[Create a shell script](/bin/datetime-request) to test the middleware.

Restart the server.

```
./bin/datetime-request
```

You should see:

```
...
{"started":"2015-01-14T22:54:35.708Z","uptime":3.494}
```

> Your date and time will be different.

###10. Conclusion

You've now seen various ways to implement your own logic within a LoopBack application. For more information, see the [LoopBack app logic documentation](http://docs.strongloop.com/display/LB/Adding+application+logic)

---

- [Next tutorial][next-tutorial]
- [All tutorials][all-tutorials]

[all-tutorials]: https://github.com/strongloop/loopback-example
[explorer]: http://localhost:3000/explorer
[localhost]: http://localhost:3000
[next-tutorial]: https://github.com/strongloop/loopback-example-access-control
