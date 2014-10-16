#Overview
In a real world application, you will need additional rest
endpoints with your custom logic, rest endpoints that are no provided/built-in
to loopback.

we will be building an app that demonstrates how to integrate custom application
logic into loopback and how to manage events using remote hooks, which allow you
perform addition logic in a specific time of the request life cycle.

##exposing models over rest api
There are 3 ways to expose models over rest api

##1. built-in
There are system defined models that are "built-in" 

###1. create boot scripts in `/server/boot`
- there are two types of boot scripts
  - sync scripts
    - export a function that takes `app` as an arg
      - module.exports = function(app) { ... }
      - example
  - async scripts
    - export a function that takes `app` and `cb` (callback) as an argument
      - module.exports = function(app, cb) { ... }
      - example
- sync vs async
  - why sync
  - why async
  - when to choose one over the other

###2. directly in the model in `common/models`
- remote method
  - what is it
  - how do we create one
- remote hook
  - what is it
  - how do we create one

###3. directly in `server/server.js`
- create some custom middleware
  - matrix
  - what can you do and with what mechanism
  - whats the contract you should follow

##hook into the request lifecycle
we can use remote methods to hook into the request lifecycle. typically when a
request comes in, it gets router through middleware and finally the app
function as shown here:

[picture of request going through squares and lifecycle phases]
[-|first|---|beforehook|---|something here|-|afterhook|-- req --->function
signature]

During each phase of the request lifecycle, we can add our own custom
logic in between or "hook into the phases of the lifecycle.

We can do this by adding a script in th boot directory that defines our hooks
when the app starts up. or we can define them in common/models/yourmodel.js
which also defined hooks when the app starts up.

##the app
In this demo, we're going to build a server side app that returns json
responses. we will not need a front end for this app as we are demonstrating
capabilities into the rest api. we will use curl to make requests to our rest
api and inspect the resulting json to make sure whats being returned is as
expected. We will also add debugging (using debug) to let us visualize the
request as it is being processed.

#the demo
##Prerequisites
slc
loopback
curl

##Running the demo

##Building the demo

##bootstrap the app
##datasource
don't matter, we will use in memory
##create some models
Person
  remote method
    greet

###defining remote methods
###defining remote hooks
