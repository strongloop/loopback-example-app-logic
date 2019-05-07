// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-app-logic
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = function(app) {
  var models = [];

  Object.keys(app.models).forEach(function(model) {
    var modelName = app.models[model].modelName;

    if (models.indexOf(modelName) === -1)
      models.push(modelName);
  });

  console.log('Models: ', models);
};
